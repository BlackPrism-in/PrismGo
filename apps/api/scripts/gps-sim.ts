/**
 * GPS simulator: drives a vehicle through the real webhook so the live map,
 * trip detector and notifications can be seen end to end without the vendor.
 *
 *   pnpm --filter @prismgo/api sim demo              # book a fresh trip (seeded users) and drive it
 *   pnpm --filter @prismgo/api sim PG-1001           # drive the vehicle assigned to an existing request
 *   options: --step 250  metres per tick   --every 2  seconds between ticks
 *
 * Logs in with the on-screen code (dev, or staging with OTP_EXPOSE_CODE=true).
 * Against a UAT server: SIM_API_URL=https://<domain>/api/v1 GPS_WEBHOOK_SECRET=… \
 *   SIM_MANAGER_PHONE=<transport manager> pnpm --filter @prismgo/api sim PG-1001
 * (demo mode there also needs SIM_REQUESTER_PHONE and SIM_HOD_PHONE: the requester's HOD).
 */
import 'dotenv/config';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { distanceM, interpolate, bearing, type LatLng } from '@prismgo/shared';

const API = process.env['SIM_API_URL'] ?? `http://localhost:${process.env['PORT'] ?? 4000}/api/v1`;
const SECRET = process.env['GPS_WEBHOOK_SECRET'] ?? '';
const args = process.argv.slice(2);
const opt = (name: string, fallback: number) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? Number(args[i + 1]) : fallback;
};
const STEP_M = opt('step', 250);
const EVERY_S = opt('every', 2);
const target = args.find((a) => !a.startsWith('--') && !/^\d+$/.test(a)) ?? 'demo';

const SEED = {
  requester: process.env['SIM_REQUESTER_PHONE'] ?? '+919000000005',
  hod: process.env['SIM_HOD_PHONE'] ?? '+919000000003',
  manager: process.env['SIM_MANAGER_PHONE'] ?? '+919000000002',
};

async function call<T>(method: string, path: string, token?: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = (await res.json().catch(() => ({}))) as T & { message?: string };
  if (!res.ok)
    throw new Error(`${method} ${path} → ${res.status} ${JSON.stringify(data.message ?? data)}`);
  return data;
}

/** Refresh tokens per server and phone, so repeated runs don't use up login codes (3 per 10 min). */
const TOKEN_CACHE = resolve(__dirname, '..', '.sim-tokens.json');
const cache: Record<string, string> = existsSync(TOKEN_CACHE)
  ? (JSON.parse(readFileSync(TOKEN_CACHE, 'utf8')) as Record<string, string>)
  : {};

async function login(phone: string): Promise<string> {
  const key = `${API} ${phone}`;
  const cached = cache[key];
  if (cached) {
    try {
      const pair = await call<{ accessToken: string; refreshToken: string }>(
        'POST',
        '/auth/refresh',
        undefined,
        {
          refreshToken: cached,
        },
      );
      cache[key] = pair.refreshToken;
      writeFileSync(TOKEN_CACHE, JSON.stringify(cache, null, 2));
      return pair.accessToken;
    } catch {
      delete cache[key];
    }
  }
  const { devCode } = await call<{ devCode?: string }>('POST', '/auth/otp/request', undefined, {
    phone,
  });
  if (!devCode)
    throw new Error(
      'No code returned. Needs OTP_CHANNELS=console (dev) or OTP_EXPOSE_CODE=true (staging).',
    );
  const pair = await call<{ accessToken: string; refreshToken: string }>(
    'POST',
    '/auth/otp/verify',
    undefined,
    {
      phone,
      code: devCode,
    },
  );
  cache[key] = pair.refreshToken;
  writeFileSync(TOKEN_CACHE, JSON.stringify(cache, null, 2));
  return pair.accessToken;
}

interface Req {
  id: string;
  code: string;
  status: string;
  pickup: LatLng & { address: string };
  drop: LatLng & { address: string };
  returnAt: string | null;
  trip: { id: string; vehicle: { id: string; regNo: string } } | null;
}

async function bookDemo(manager: string): Promise<Req> {
  const requester = await login(SEED.requester);
  const hod = await login(SEED.hod);
  const r = await call<Req>('POST', '/requests', requester, {
    pickup: { address: 'PrismGo Demo Office, MG Road, Bengaluru', lat: 12.9756, lng: 77.6066 },
    drop: { address: 'Whitefield Tech Park, Bengaluru', lat: 12.9698, lng: 77.75 },
    startAt: new Date(Date.now() + 5 * 60_000).toISOString(),
    passengers: 2,
    purpose: 'GPS simulator demo',
  });
  await call('POST', `/requests/${r.id}/approve`, hod, { comment: 'Simulator' });
  const from = new Date(Date.now() + 5 * 60_000).toISOString();
  const to = new Date(Date.now() + 2 * 60 * 60_000).toISOString();
  const avail = await call<{
    vehicles: { id: string; available: boolean; fits: boolean }[];
    drivers: { id: string; available: boolean }[];
  }>(
    'GET',
    `/availability?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&passengers=2`,
    manager,
  );
  const vehicle = avail.vehicles.find((v) => v.available && v.fits);
  const driver = avail.drivers.find((d) => d.available);
  if (!vehicle || !driver) throw new Error('No free vehicle and driver for the demo');
  return call<Req>('POST', `/requests/${r.id}/assign`, manager, {
    vehicleId: vehicle.id,
    driverId: driver.id,
  });
}

/** Evenly spaced points from a to b, at most STEP_M apart. */
function leg(a: LatLng, b: LatLng): LatLng[] {
  const n = Math.max(1, Math.ceil(distanceM(a, b) / STEP_M));
  return Array.from({ length: n }, (_, i) => interpolate(a, b, (i + 1) / n));
}

async function main() {
  if (!SECRET) throw new Error('GPS_WEBHOOK_SECRET is not set (see apps/api/.env)');
  const manager = await login(SEED.manager);

  let req: Req;
  if (target === 'demo') {
    req = await bookDemo(manager);
    console.log(`Booked ${req.code}: ${req.pickup.address} → ${req.drop.address}`);
  } else {
    const all = await call<Req[]>('GET', '/requests?scope=all', manager);
    const found = all.find((r) => r.code.toUpperCase() === target.toUpperCase());
    if (!found) throw new Error(`Request ${target} not found`);
    if (!found.trip)
      throw new Error(`${found.code} has no vehicle assigned (status ${found.status})`);
    req = found;
  }

  const vehicles = await call<{ id: string; regNo: string; gpsDeviceId: string | null }[]>(
    'GET',
    '/vehicles',
    manager,
  );
  const vehicle = vehicles.find((v) => v.id === req.trip!.vehicle.id)!;
  if (!vehicle.gpsDeviceId) throw new Error(`${vehicle.regNo} has no GPS device id`);

  // Start ~1.5 km south-west of pickup, wait at pickup, drive to drop (and back if return).
  const start = { lat: req.pickup.lat - 0.01, lng: req.pickup.lng - 0.01 };
  const wait = (p: LatLng, n: number) => Array.from({ length: n }, () => p);
  const route: LatLng[] = [
    ...leg(start, req.pickup),
    ...wait(req.pickup, 3),
    ...leg(req.pickup, req.drop),
  ];
  if (req.returnAt) route.push(...wait(req.drop, 3), ...leg(req.drop, req.pickup));

  console.log(
    `Driving ${vehicle.regNo} (${vehicle.gpsDeviceId}) for ${req.code}: ${route.length} points, one every ${EVERY_S}s`,
  );
  let odometer = 25_000 + Math.random() * 1000;
  let prev = start;
  for (const [i, p] of route.entries()) {
    const moved = distanceM(prev, p);
    odometer += moved / 1000;
    // Retry through brief API restarts (dev hot reload), like a tracker feed would.
    const post = () =>
      fetch(`${API}/gps/webhook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-GPS-Secret': SECRET },
        body: JSON.stringify({
          points: [
            {
              deviceId: vehicle.gpsDeviceId,
              recordedAt: new Date().toISOString(),
              lat: Number(p.lat.toFixed(6)),
              lng: Number(p.lng.toFixed(6)),
              speedKmh: moved > 0 ? 35 : 0,
              heading: moved > 0 ? Math.round(bearing(prev, p)) : undefined,
              ignition: true,
              odometerKm: Number(odometer.toFixed(2)),
            },
          ],
        }),
      });
    let res: Response | null = null;
    for (let attempt = 1; attempt <= 5 && !res; attempt++) {
      try {
        res = await post();
      } catch {
        await new Promise((r) => setTimeout(r, 2000));
      }
    }
    if (!res) throw new Error('API unreachable after 5 attempts');
    if (!res.ok) throw new Error(`webhook ${res.status}: ${await res.text()}`);
    if (i % 10 === 0) {
      const r = await call<Req>('GET', `/requests/${req.id}`, manager);
      process.stdout.write(
        `\r${i + 1}/${route.length} points · ${req.code} is ${r.status.replace('_', ' ')}   `,
      );
    }
    prev = p;
    await new Promise((r) => setTimeout(r, EVERY_S * 1000));
  }
  const done = await call<Req>('GET', `/requests/${req.id}`, manager);
  console.log(`\nFinished. ${done.code} is ${done.status.replace('_', ' ')}.`);
}

main().catch((err: Error) => {
  console.error(err.message);
  process.exit(1);
});
