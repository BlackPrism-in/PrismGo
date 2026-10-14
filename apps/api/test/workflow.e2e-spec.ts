import { INestApplication } from '@nestjs/common';
import type { AddressInfo } from 'node:net';
import { io, type Socket } from 'socket.io-client';
import request from 'supertest';
import type { PrismaClient } from '../src/generated/prisma/client';
import { createApp, future, login, PHONES, resetOtps, resetWorkflow, testPrisma } from './helpers';

const place = (address: string, lat: number, lng: number) => ({ address, lat, lng });
const office = place('PrismGo Demo Office, MG Road, Bengaluru', 12.9756, 77.6066);
const airport = place('Kempegowda International Airport, Bengaluru', 13.1989, 77.7068);

describe('request → approve → assign', () => {
  let app: INestApplication;
  let prisma: PrismaClient;
  const t: Record<string, string> = {};
  const http = () => request(app.getHttpServer());
  const as = (who: string) => ({ Authorization: `Bearer ${t[who]}` });

  let dzire: string;
  let innova: string;
  let suresh: string;
  let manoj: string;

  beforeAll(async () => {
    prisma = testPrisma();
    await resetOtps(prisma);
    await resetWorkflow(prisma);
    app = await createApp();
    await app.listen(0);
    for (const [k, phone] of Object.entries(PHONES)) t[k] = (await login(app, phone)).accessToken;
    dzire = (await prisma.vehicle.findFirstOrThrow({ where: { regNo: 'KA01AB1001' } })).id;
    innova = (await prisma.vehicle.findFirstOrThrow({ where: { regNo: 'KA01AB1002' } })).id;
    suresh = (await prisma.driver.findFirstOrThrow({ where: { licenceNo: 'DL-SEED-0001' } })).id;
    manoj = (await prisma.driver.findFirstOrThrow({ where: { licenceNo: 'DL-SEED-0002' } })).id;
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  const create = (who: string, body: Record<string, unknown> = {}) =>
    http()
      .post('/api/v1/requests')
      .set(as(who))
      .send({
        pickup: office,
        drop: airport,
        startAt: future(3, 9),
        passengers: 2,
        purpose: 'Client visit',
        ...body,
      });

  it('runs the full happy path with the right notifications', async () => {
    const created = await create('requester', { passengers: 5 }).expect(201);
    const id = created.body.id;
    expect(created.body).toMatchObject({
      status: 'pending_approval',
      code: expect.stringMatching(/^PG-\d+$/),
    });
    expect(created.body.actions).toEqual(['edit', 'cancel']);

    // HOD of Operations sees it with approve/reject; Finance HOD can't see it at all.
    const asHod = await http().get(`/api/v1/requests/${id}`).set(as('hodOps')).expect(200);
    expect(asHod.body.actions).toEqual(expect.arrayContaining(['approve', 'reject', 'cancel']));
    await http().get(`/api/v1/requests/${id}`).set(as('hodFinance')).expect(404);
    await http().post(`/api/v1/requests/${id}/approve`).set(as('hodFinance')).send({}).expect(404);
    await http().post(`/api/v1/requests/${id}/approve`).set(as('requester')).send({}).expect(403);

    const pending = await http()
      .get('/api/v1/requests?scope=approvals&status=pending_approval')
      .set(as('hodOps'))
      .expect(200);
    expect(pending.body.map((r: { id: string }) => r.id)).toContain(id);

    const approved = await http()
      .post(`/api/v1/requests/${id}/approve`)
      .set(as('hodOps'))
      .send({ comment: 'Go ahead' })
      .expect(200);
    expect(approved.body.status).toBe('approved');

    // A 4-seat car can't carry 5; the Innova can.
    await http()
      .post(`/api/v1/requests/${id}/assign`)
      .set(as('manager'))
      .send({ vehicleId: dzire, driverId: suresh })
      .expect(400);
    const assigned = await http()
      .post(`/api/v1/requests/${id}/assign`)
      .set(as('manager'))
      .send({ vehicleId: innova, driverId: suresh })
      .expect(200);
    expect(assigned.body.status).toBe('assigned');
    expect(assigned.body.trip).toMatchObject({
      status: 'scheduled',
      vehicle: { regNo: 'KA01AB1002' },
      driver: { name: 'Suresh Kumar' },
    });
    expect(assigned.body.timeline.map((e: { type: string }) => e.type)).toEqual([
      'created',
      'submitted',
      'approved',
      'assigned',
    ]);

    const templatesFor = async (where: object) =>
      (await prisma.notification.findMany({ where: { ...where, request: undefined } as never }))
        .filter((n) => (n.payload as { requestId?: string }).requestId === id)
        .map((n) => `${n.channel}:${n.template}`)
        .sort();
    const hod = await prisma.user.findUniqueOrThrow({ where: { phone: PHONES.hodOps } });
    const mgr = await prisma.user.findUniqueOrThrow({ where: { phone: PHONES.manager } });
    const req = await prisma.user.findUniqueOrThrow({ where: { phone: PHONES.requester } });
    expect(await templatesFor({ userId: hod.id })).toEqual([
      'in_app:request_submitted',
      'whatsapp:request_submitted',
    ]);
    expect(await templatesFor({ userId: mgr.id })).toEqual([
      'in_app:request_ready_to_assign',
      'whatsapp:request_ready_to_assign',
    ]);
    expect(await templatesFor({ userId: req.id })).toEqual([
      'in_app:request_approved',
      'in_app:trip_assigned',
      'whatsapp:request_approved',
      'whatsapp:trip_assigned',
    ]);
    expect(await templatesFor({ recipientPhone: '+919000000101', userId: null })).toEqual([
      'whatsapp:driver_trip_assigned',
    ]);
  });

  it('blocks double-booking and shows the conflict in availability', async () => {
    const start = future(5, 10);
    const a = await create('requester', { startAt: start }).expect(201);
    const b = await create('requesterFinance', { startAt: start }).expect(201);
    await http()
      .post(`/api/v1/requests/${a.body.id}/approve`)
      .set(as('hodOps'))
      .send({})
      .expect(200);
    await http()
      .post(`/api/v1/requests/${b.body.id}/approve`)
      .set(as('hodFinance'))
      .send({})
      .expect(200);

    await http()
      .post(`/api/v1/requests/${a.body.id}/assign`)
      .set(as('manager'))
      .send({ vehicleId: dzire, driverId: suresh })
      .expect(200);

    const avail = await http()
      .get(
        `/api/v1/availability?from=${encodeURIComponent(start)}&to=${encodeURIComponent(future(5, 11))}`,
      )
      .set(as('manager'))
      .expect(200);
    const d = avail.body.vehicles.find((v: { id: string }) => v.id === dzire);
    expect(d).toMatchObject({ available: false, conflict: { requestCode: a.body.code } });

    // Same vehicle, overlapping time: the database constraint refuses it.
    const clash = await http()
      .post(`/api/v1/requests/${b.body.id}/assign`)
      .set(as('manager'))
      .send({ vehicleId: dzire, driverId: manoj })
      .expect(409);
    expect(clash.body.message).toMatch(/already booked/);
    const still = await http().get(`/api/v1/requests/${b.body.id}`).set(as('manager')).expect(200);
    expect(still.body.status).toBe('approved');

    // Reassign A to the other driver, then cancel it: the Dzire is free again.
    const trip = (await http().get(`/api/v1/requests/${a.body.id}`).set(as('manager'))).body.trip;
    const re = await http()
      .post(`/api/v1/trips/${trip.id}/reassign`)
      .set(as('manager'))
      .send({ driverId: manoj })
      .expect(200);
    expect(re.body.trip.driver.name).toBe('Manoj Singh');
    expect(re.body.timeline.map((e: { type: string }) => e.type)).toContain('reassigned');

    const cancelled = await http()
      .post(`/api/v1/requests/${a.body.id}/cancel`)
      .set(as('requester'))
      .send({ reason: 'Meeting moved online' })
      .expect(200);
    expect(cancelled.body).toMatchObject({
      status: 'cancelled',
      trip: null,
      cancelReason: 'Meeting moved online',
    });

    await http()
      .post(`/api/v1/requests/${b.body.id}/assign`)
      .set(as('manager'))
      .send({ vehicleId: dzire, driverId: suresh })
      .expect(200);
  });

  it('auto-approves an HOD’s own request and notifies managers', async () => {
    const own = await create('hodOps', { startAt: future(7, 15) }).expect(201);
    expect(own.body.status).toBe('approved');
    expect(own.body.timeline.map((e: { type: string }) => e.type)).toContain('auto_approved');
  });

  it('requires a comment to reject, and rejected requests cannot be assigned', async () => {
    const r = await create('requester', { startAt: future(8, 9) }).expect(201);
    await http()
      .post(`/api/v1/requests/${r.body.id}/reject`)
      .set(as('hodOps'))
      .send({})
      .expect(400);
    await http()
      .post(`/api/v1/requests/${r.body.id}/reject`)
      .set(as('hodOps'))
      .send({ comment: 'Use the shuttle' })
      .expect(200);
    const assign = await http()
      .post(`/api/v1/requests/${r.body.id}/assign`)
      .set(as('manager'))
      .send({ vehicleId: dzire, driverId: suresh })
      .expect(409);
    expect(assign.body.message).toBe("Can't assign a request that is rejected");
  });

  it('lets only one of two simultaneous decisions win', async () => {
    const r = await create('requester', { startAt: future(9, 9) }).expect(201);
    const results = await Promise.all([
      http().post(`/api/v1/requests/${r.body.id}/approve`).set(as('hodOps')).send({}),
      http()
        .post(`/api/v1/requests/${r.body.id}/reject`)
        .set(as('hodOps'))
        .send({ comment: 'Not needed' }),
    ]);
    expect(results.map((x) => x.status).sort()).toEqual([200, 409]);
  });

  it('keeps drafts private and validates times', async () => {
    const draft = await create('requester', { submit: false, startAt: future(10) }).expect(201);
    expect(draft.body.status).toBe('draft');
    expect(draft.body.actions).toEqual(['edit', 'submit', 'cancel']);
    await http().get(`/api/v1/requests/${draft.body.id}`).set(as('hodOps')).expect(404);
    await http().post(`/api/v1/requests/${draft.body.id}/submit`).set(as('requester')).expect(200);

    await create('requester', { startAt: '2020-01-01T10:00:00Z' }).expect(400);
    await create('requester', { startAt: future(4, 10), returnAt: future(4, 9) }).expect(400);
    await http().get('/api/v1/requests?scope=all').set(as('requester')).expect(403);
  });

  it('lists notifications and marks them read', async () => {
    const before = await http()
      .get('/api/v1/notifications/unread-count')
      .set(as('requester'))
      .expect(200);
    expect(before.body.count).toBeGreaterThan(0);
    const list = await http().get('/api/v1/notifications').set(as('requester')).expect(200);
    expect(list.body[0]).toMatchObject({
      title: expect.any(String),
      requestId: expect.any(String),
      readAt: null,
    });
    await http().post('/api/v1/notifications/read-all').set(as('requester')).expect(204);
    const after = await http()
      .get('/api/v1/notifications/unread-count')
      .set(as('requester'))
      .expect(200);
    expect(after.body.count).toBe(0);
  });

  it('pushes request.updated and notification over the socket', async () => {
    const { port } = app.getHttpServer().address() as AddressInfo;
    const socket: Socket = io(`http://127.0.0.1:${port}`, {
      path: '/api/v1/socket.io',
      auth: { token: t['requester'] },
      transports: ['websocket'],
    });
    await new Promise<void>((resolve, reject) => {
      socket.on('connect', () => resolve());
      socket.on('connect_error', reject);
    });

    const r = await create('requester', { startAt: future(11, 9) }).expect(201);
    const updated = new Promise<{ id: string; status: string }>((resolve) => {
      socket.on('request.updated', (e: { id: string; status: string }) => {
        if (e.status === 'approved') resolve(e);
      });
    });
    const notified = new Promise<{ title: string }>((resolve) =>
      socket.on('notification', resolve),
    );
    await http()
      .post(`/api/v1/requests/${r.body.id}/approve`)
      .set(as('hodOps'))
      .send({})
      .expect(200);

    await expect(updated).resolves.toEqual({ id: r.body.id, status: 'approved' });
    await expect(notified).resolves.toMatchObject({ title: `${r.body.code} approved` });
    socket.disconnect();
  });

  it('rejects socket connections without a valid token', async () => {
    const { port } = app.getHttpServer().address() as AddressInfo;
    const socket = io(`http://127.0.0.1:${port}`, {
      path: '/api/v1/socket.io',
      auth: { token: 'nope' },
      transports: ['websocket'],
    });
    await new Promise<void>((resolve) => socket.on('disconnect', () => resolve()));
    expect(socket.connected).toBe(false);
  });
});
