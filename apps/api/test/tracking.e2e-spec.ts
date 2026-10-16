import { INestApplication } from '@nestjs/common';
import { distanceM, interpolate, type LatLng } from '@prismgo/shared';
import type { AddressInfo } from 'node:net';
import { io } from 'socket.io-client';
import request from 'supertest';
import type { PrismaClient } from '../src/generated/prisma/client';
import { GpsPullProcessor } from '../src/tracking/gps-pull.processor';
import { GpsWatchdogProcessor } from '../src/tracking/gps-watchdog.processor';
import { TrakzeeClient } from '../src/tracking/vendor/trakzee';
import { createApp, login, PHONES, resetOtps, resetWorkflow, testPrisma } from './helpers';

const office: LatLng = { lat: 12.9756, lng: 77.6066 };
const airport: LatLng = { lat: 13.1989, lng: 77.7068 };
const SECRET = 'test-gps-secret';

/** Points every ~`stepM` metres from a to b, timestamped `stepS` seconds apart from `t0`. */
function drive(a: LatLng, b: LatLng, t0: number, stepM = 400, stepS = 30) {
  const n = Math.max(1, Math.ceil(distanceM(a, b) / stepM));
  return Array.from({ length: n + 1 }, (_, i) => ({
    ...interpolate(a, b, i / n),
    t: t0 + i * stepS * 1000,
  }));
}

describe('GPS tracking', () => {
  let app: INestApplication;
  let prisma: PrismaClient;
  const t: Record<string, string> = {};
  const http = () => request(app.getHttpServer());
  const as = (who: string) => ({ Authorization: `Bearer ${t[who]}` });
  let dzire: string;
  let innova: string;
  let suresh: string;
  let manoj: string;
  let odometer = 10_000;

  /** Sends points for a device; recordedAt is in the past so the batch is never "future". */
  const send = (deviceId: string, pts: { lat: number; lng: number; t: number }[], extra = {}) =>
    http()
      .post('/api/v1/gps/webhook')
      .set('X-GPS-Secret', SECRET)
      .send({
        points: pts.map((p) => ({
          deviceId,
          recordedAt: new Date(p.t).toISOString(),
          lat: p.lat,
          lng: p.lng,
          speedKmh: 30,
          odometerKm: (odometer += 0.4),
          ...extra,
        })),
      });

  /** Request → approve → assign, starting `inMin` minutes from now. Returns request and trip ids. */
  async function bookTrip(
    vehicleId: string,
    driverId: string,
    opts: { inMin?: number; returnInMin?: number } = {},
  ) {
    const startAt = new Date(Date.now() + (opts.inMin ?? 10) * 60_000).toISOString();
    const returnAt = opts.returnInMin
      ? new Date(Date.now() + opts.returnInMin * 60_000).toISOString()
      : null;
    const r = await http()
      .post('/api/v1/requests')
      .set(as('requester'))
      .send({
        pickup: { address: 'Office', ...office },
        drop: { address: 'Airport', ...airport },
        startAt,
        returnAt,
        passengers: 2,
        purpose: 'Airport run',
      })
      .expect(201);
    await http()
      .post(`/api/v1/requests/${r.body.id}/approve`)
      .set(as('hodOps'))
      .send({})
      .expect(200);
    const a = await http()
      .post(`/api/v1/requests/${r.body.id}/assign`)
      .set(as('manager'))
      .send({ vehicleId, driverId })
      .expect(200);
    return { requestId: r.body.id as string, tripId: a.body.trip.id as string };
  }

  const status = async (requestId: string) =>
    (await http().get(`/api/v1/requests/${requestId}`).set(as('requester')).expect(200)).body;

  beforeAll(async () => {
    prisma = testPrisma();
    await resetOtps(prisma);
    await resetWorkflow(prisma);
    await prisma.vehicle.updateMany({ data: { status: 'available' } });
    app = await createApp();
    await app.listen(0);
    for (const [k, phone] of Object.entries(PHONES)) t[k] = (await login(app, phone)).accessToken;
    dzire = (await prisma.vehicle.findFirstOrThrow({ where: { gpsDeviceId: 'SIM-001' } })).id;
    innova = (await prisma.vehicle.findFirstOrThrow({ where: { gpsDeviceId: 'SIM-002' } })).id;
    suresh = (await prisma.driver.findFirstOrThrow({ where: { licenceNo: 'DL-SEED-0001' } })).id;
    manoj = (await prisma.driver.findFirstOrThrow({ where: { licenceNo: 'DL-SEED-0002' } })).id;
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  it('checks the shared secret and reports unknown devices', async () => {
    const get = await http().get('/api/v1/gps/webhook').expect(405);
    expect(get.headers['allow']).toBe('POST');
    await http()
      .post('/api/v1/gps/webhook')
      .set('X-GPS-Secret', 'wrong')
      .send({
        points: [{ deviceId: 'SIM-001', recordedAt: new Date().toISOString(), lat: 1, lng: 1 }],
      })
      .expect(401);
    const res = await send('NOT-A-DEVICE', [{ ...office, t: Date.now() - 1000 }]).expect(200);
    expect(res.body).toEqual({
      accepted: 0,
      duplicates: 0,
      rejected: 1,
      unknownDevices: ['NOT-A-DEVICE'],
    });
  });

  it('starts when the vehicle leaves pickup and completes at the drop', async () => {
    const { requestId, tripId } = await bookTrip(dzire, suresh);
    const t0 = Date.now() - 20 * 60_000; // within the hour before pickup, all in the past
    const approach = drive({ lat: 12.96, lng: 77.59 }, office, t0, 400, 20);
    const res = await send('SIM-001', approach).expect(200);
    expect(res.body.accepted).toBe(approach.length);
    expect((await status(requestId)).status).toBe('assigned');

    // Same batch again: stored once.
    const dup = await send('SIM-001', approach.slice(-3)).expect(200);
    expect(dup.body).toMatchObject({ accepted: 0, duplicates: 3 });

    // Leave the pickup: trip starts.
    const tLeave = approach.at(-1)!.t + 60_000;
    const toAirport = drive(office, airport, tLeave, 400, 5);
    await send('SIM-001', toAirport.slice(1, 4)).expect(200);
    let r = await status(requestId);
    expect(r.status).toBe('in_progress');
    expect(r.timeline.map((e: { type: string }) => e.type)).toContain('started');
    expect((await prisma.vehicle.findUniqueOrThrow({ where: { id: dzire } })).status).toBe(
      'on_trip',
    );

    // Live view and track while driving.
    const live = await http().get('/api/v1/live/vehicles').set(as('manager')).expect(200);
    const v = live.body.find((x: { id: string }) => x.id === dzire);
    // Test points are minutes old, so the position counts as stale (no GPS in the last 5 min).
    expect(v).toMatchObject({
      stale: true,
      position: { lat: expect.any(Number) },
      trip: { id: tripId, status: 'in_progress', etaTo: 'drop' },
    });
    expect(v.trip.etaMinutes).toBeGreaterThan(30);
    await http().get('/api/v1/live/vehicles').set(as('requester')).expect(403);
    const track = await http()
      .get(`/api/v1/trips/${tripId}/track`)
      .set(as('requester'))
      .expect(200);
    expect(track.body.points.length).toBeGreaterThanOrEqual(3);
    expect(track.body).toMatchObject({
      status: 'in_progress',
      etaTo: 'drop',
      vehicleRegNo: 'KA01AB1001',
    });

    // Reach the drop: completed, distance from odometer, vehicle free.
    await send('SIM-001', toAirport.slice(4)).expect(200);
    r = await status(requestId);
    expect(r.status).toBe('completed');
    expect(r.timeline.map((e: { type: string }) => e.type)).toEqual(
      expect.arrayContaining(['started', 'ended']),
    );
    const trip = await prisma.trip.findUniqueOrThrow({ where: { id: tripId } });
    expect(trip.distanceKm).toBeGreaterThan(20);
    expect((await prisma.vehicle.findUniqueOrThrow({ where: { id: dzire } })).status).toBe(
      'available',
    );

    const requester = await prisma.user.findUniqueOrThrow({ where: { phone: PHONES.requester } });
    const sent = await prisma.notification.findMany({
      where: { userId: requester.id, channel: 'in_app' },
    });
    expect(sent.map((n) => n.template)).toEqual(
      expect.arrayContaining(['trip_started', 'trip_completed']),
    );
  });

  it('lets a manager start and end a trip by hand, but not a requester', async () => {
    const { requestId, tripId } = await bookTrip(innova, manoj, { inMin: 30 });
    await http().post(`/api/v1/trips/${tripId}/start`).set(as('requester')).expect(403);
    const started = await http()
      .post(`/api/v1/trips/${tripId}/start`)
      .set(as('manager'))
      .expect(200);
    expect(started.body).toMatchObject({ id: requestId, status: 'in_progress' });
    expect(started.body.actions).toContain('end');
    await http().post(`/api/v1/trips/${tripId}/start`).set(as('manager')).expect(409);
    const ended = await http().post(`/api/v1/trips/${tripId}/end`).set(as('manager')).expect(200);
    expect(ended.body.status).toBe('completed');
  });

  it('ends a round trip only when the vehicle is back at pickup', async () => {
    const { requestId } = await bookTrip(dzire, suresh, { inMin: 20, returnInMin: 200 });
    const t0 = Date.now() - 35 * 60_000;
    const out = [
      ...drive({ lat: 12.97, lng: 77.6 }, office, t0, 400, 10),
      ...drive(office, airport, t0 + 5 * 60_000, 1000, 20),
    ];
    await send('SIM-001', out).expect(200);
    let r = await status(requestId);
    expect(r.status).toBe('in_progress');
    expect(r.timeline.map((e: { type: string }) => e.type)).toContain('dropped');

    const back = drive(airport, office, out.at(-1)!.t + 60_000, 1000, 20).map((p) => ({
      ...p,
      t: Math.min(p.t, Date.now() - 1000),
    }));
    await send('SIM-001', back).expect(200);
    r = await status(requestId);
    expect(r.status).toBe('completed');
  });

  it('rejects points from the future', async () => {
    const res = await send('SIM-002', [{ ...office, t: Date.now() + 10 * 60_000 }]).expect(200);
    expect(res.body).toMatchObject({ accepted: 0, rejected: 1 });
  });

  it('pushes the vehicle position to the requester of the active trip', async () => {
    const { tripId } = await bookTrip(innova, manoj, { inMin: 15 });
    const { port } = app.getHttpServer().address() as AddressInfo;
    const socket = io(`http://127.0.0.1:${port}`, {
      path: '/api/v1/socket.io',
      auth: { token: t['requester'] },
      transports: ['websocket'],
    });
    await new Promise<void>((resolve) => socket.on('connect', () => resolve()));
    const got = new Promise<{ tripId: string; etaTo: string }>((resolve) =>
      socket.on('vehicle.position', resolve),
    );
    await new Promise((r) => setTimeout(r, 3100)); // per-vehicle push throttle
    await send('SIM-002', [{ lat: 12.99, lng: 77.62, t: Date.now() - 500 }]).expect(200);
    await expect(got).resolves.toMatchObject({ tripId, etaTo: 'pickup' });
    socket.disconnect();
  });

  it('hides the vehicle on a trip that is more than an hour away', async () => {
    // Innova has a live position from the socket test, but this trip is 10 hours out.
    const { tripId } = await bookTrip(innova, manoj, { inMin: 600 });
    const track = await http()
      .get(`/api/v1/trips/${tripId}/track`)
      .set(as('requester'))
      .expect(200);
    expect(track.body).toMatchObject({ status: 'scheduled', position: null, etaMinutes: null });
  });

  it('alerts transport once when a running trip goes quiet', async () => {
    const { tripId } = await bookTrip(dzire, suresh, { inMin: 40 });
    await prisma.trip.update({ where: { id: tripId }, data: {} });
    await http().post(`/api/v1/trips/${tripId}/start`).set(as('manager')).expect(200);
    // Pretend it started 10 minutes ago and the last GPS was before that.
    await prisma.trip.update({
      where: { id: tripId },
      data: { actualStart: new Date(Date.now() - 10 * 60_000) },
    });
    await send('SIM-001', [{ ...office, t: Date.now() - 9 * 60_000 }]).expect(200);

    const watchdog = app.get(GpsWatchdogProcessor);
    await watchdog.process();
    await watchdog.process();
    const events = await prisma.tripEvent.findMany({ where: { tripId, type: 'gps_lost' } });
    expect(events).toHaveLength(1);
    const mgr = await prisma.user.findUniqueOrThrow({ where: { phone: PHONES.manager } });
    expect(
      await prisma.notification.count({
        where: { userId: mgr.id, template: 'gps_lost', channel: 'in_app' },
      }),
    ).toBe(1);
  });

  it('polls the GPS vendor and feeds new fixes into tracking', async () => {
    // Vendor time is IST without a zone: "DD-MM-YYYY HH:mm:ss".
    const ist = (ms: number) => {
      const d = new Date(ms + 330 * 60_000).toISOString();
      return `${d.slice(8, 10)}-${d.slice(5, 7)}-${d.slice(0, 4)} ${d.slice(11, 19)}`;
    };
    // Newer than anything earlier tests sent for this vehicle (up to 2 min ahead is accepted).
    const fixAt = Math.floor((Date.now() + 60_000) / 1000) * 1000;
    const rows = [
      {
        Imeino: 'SIM-002',
        Latitude: '12.9800',
        Longitude: '77.6100',
        GPSActualTime: ist(fixAt),
        Speed: '18',
        IGN: 'ON',
      },
      // Another vehicle on the vendor account: ignored.
      { Imeino: 'OTHER-999', Latitude: '23.04', Longitude: '72.53', GPSActualTime: ist(fixAt) },
    ];
    const fetchFn = (async (url: string) =>
      new Response(
        JSON.stringify(
          url.includes('generateAccessToken')
            ? { token: 'test-token-1234567890' }
            : { root: { VehicleData: rows } },
        ),
      )) as typeof fetch;
    const poller = app.get(GpsPullProcessor);
    Object.assign(poller, {
      client: new TrakzeeClient(
        {
          baseUrl: 'http://vendor.test/webservice',
          username: 'u',
          password: 'p',
          projectId: '37',
          company: 'Test',
          timeZone: '+05:30',
        },
        fetchFn,
      ),
    });

    expect(await poller.process()).toEqual({ rows: 2, sent: 1 });
    const live = await http().get('/api/v1/live/vehicles').set(as('manager')).expect(200);
    const innovaLive = live.body.find((v: { id: string }) => v.id === innova);
    expect(innovaLive.position).toMatchObject({
      lat: 12.98,
      lng: 77.61,
      speedKmh: 18,
      recordedAt: new Date(fixAt).toISOString(),
    });

    // Unchanged fix on the next poll: nothing new to process.
    expect(await poller.process()).toEqual({ rows: 2, sent: 0 });
  });
});
