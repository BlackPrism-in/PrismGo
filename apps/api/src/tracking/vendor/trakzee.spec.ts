import { describe, expect, it } from 'vitest';
import { extractToken, parseVendorTime, toGpsPoint, TrakzeeClient, vendorRegNo } from './trakzee';

// Shape copied from the vendor's documentation (values changed).
const row = {
  Vehicle_Name: 'KA01AB1234',
  Vehicle_No: 'KA01AB1234',
  Company: 'Test Co',
  Latitude: '12.9756123',
  Longitude: '77.6066456',
  GPS: 'ON',
  GPSActualTime: '20-10-2026 09:30:15',
  Datetime: '20-10-2026 09:30:18',
  Status: 'RUNNING',
  Speed: '32',
  Imeino: '861234567890123',
  Odometer: '9050007',
  IGN: 'ON',
  Angle: '304',
  Power: 'ON',
  Location: '--',
};

const config = {
  baseUrl: 'http://vendor.test/webservice',
  username: 'user@example.com',
  password: 'secret',
  projectId: '37',
  company: 'Test Co',
  timeZone: '+05:30',
};

describe('Trakzee mapping', () => {
  it('reads vendor local time as IST', () => {
    expect(parseVendorTime('20-10-2026 09:30:15', '+05:30')).toBe('2026-10-20T04:00:15.000Z');
    expect(parseVendorTime('--', '+05:30')).toBeNull();
    expect(parseVendorTime('2026-10-20 09:30', '+05:30')).toBeNull();
  });

  it('maps a row to a webhook point', () => {
    expect(toGpsPoint(row, '+05:30')).toEqual({
      deviceId: '861234567890123',
      recordedAt: '2026-10-20T04:00:15.000Z',
      lat: 12.9756123,
      lng: 77.6066456,
      speedKmh: 32,
      heading: 304,
      ignition: true,
    });
  });

  it('falls back to Datetime and skips rows without a fix', () => {
    expect(toGpsPoint({ ...row, GPSActualTime: '--' }, '+05:30')?.recordedAt).toBe(
      '2026-10-20T04:00:18.000Z',
    );
    expect(toGpsPoint({ ...row, Latitude: '--' }, '+05:30')).toBeNull();
    expect(toGpsPoint({ ...row, Latitude: '0', Longitude: '0' }, '+05:30')).toBeNull();
    expect(toGpsPoint({ ...row, Imeino: '' }, '+05:30')).toBeNull();
  });

  it('leaves out unknown speed, heading and ignition', () => {
    const p = toGpsPoint({ ...row, Speed: '--', Angle: '--', IGN: '--' }, '+05:30')!;
    expect(p).not.toHaveProperty('speedKmh');
    expect(p).not.toHaveProperty('heading');
    expect(p).not.toHaveProperty('ignition');
  });

  it('normalises registration numbers and finds the token', () => {
    expect(vendorRegNo('ka 01-ab 1234')).toBe('KA01AB1234');
    expect(extractToken({ status: 'success', data: { access_token: 'x'.repeat(40) } })).toBe(
      'x'.repeat(40),
    );
    expect(extractToken('  plain-token-value-1234567  ')).toBe('plain-token-value-1234567');
    expect(extractToken({ message: 'Invalid credentials' })).toBeNull();
  });
});

describe('TrakzeeClient', () => {
  function fakeVendor() {
    const calls: { action: string; auth?: string; body: Record<string, string> }[] = [];
    let issued = 0;
    let valid = '';
    const fetchFn = (async (url: string, init: RequestInit) => {
      const action = new URL(url).searchParams.get('token')!;
      const auth = (init.headers as Record<string, string>)['auth-code'];
      const body = JSON.parse(init.body as string) as Record<string, string>;
      calls.push({ action, auth, body });
      if (action === 'generateAccessToken') {
        valid = `token-${++issued}-abcdefghijklmnop`;
        return new Response(JSON.stringify({ token: valid }));
      }
      if (auth !== valid) return new Response(JSON.stringify({ root: { error: 'Invalid token' } }));
      return new Response(JSON.stringify({ root: { VehicleData: [row] } }));
    }) as typeof fetch;
    return { calls, fetchFn, expire: () => (valid = 'expired') };
  }

  it('logs in once, then reuses the token', async () => {
    const vendor = fakeVendor();
    const client = new TrakzeeClient(config, vendor.fetchFn);
    const vehicles = [{ regNo: 'KA 01 AB 1234', imei: '861234567890123' }];
    expect(await client.live(vehicles)).toEqual([row]);
    await client.live(vehicles);
    expect(vendor.calls.map((c) => c.action)).toEqual([
      'generateAccessToken',
      'getTokenBaseLiveData',
      'getTokenBaseLiveData',
    ]);
    expect(vendor.calls[1]!.body).toEqual({
      company_names: 'Test Co',
      vehicle_nos: 'KA01AB1234',
      imei_nos: '861234567890123',
      format: 'json',
    });
  });

  it('logs in again when the token is rejected', async () => {
    const vendor = fakeVendor();
    const client = new TrakzeeClient(config, vendor.fetchFn);
    const vehicles = [{ regNo: 'KA01AB1234', imei: '861234567890123' }];
    await client.live(vehicles);
    vendor.expire();
    expect(await client.live(vehicles)).toEqual([row]);
    expect(vendor.calls.filter((c) => c.action === 'generateAccessToken')).toHaveLength(2);
  });

  it('fails clearly on bad credentials without echoing them', async () => {
    const fetchFn = (async () =>
      new Response(JSON.stringify({ message: 'Invalid' }), { status: 401 })) as typeof fetch;
    const client = new TrakzeeClient(config, fetchFn);
    await expect(client.live([{ regNo: 'X', imei: '1' }])).rejects.toThrow(
      'GPS vendor login failed (HTTP 401)',
    );
  });
});
