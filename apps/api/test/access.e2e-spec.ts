import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import type { PrismaClient } from '../src/generated/prisma/client';
import { createApp, login, PHONES, resetOtps, testPrisma } from './helpers';

const NEW_PHONE = '+919000000071';
const OTHER_PHONE = '+919000000072';

describe('self-service access requests', () => {
  let app: INestApplication;
  let prisma: PrismaClient;
  let ops: { id: string; name: string };
  let finance: { id: string; name: string };
  const http = () => request(app.getHttpServer());
  const bearer = (t: string) => ({ Authorization: `Bearer ${t}` });

  const cleanup = () =>
    prisma.user.deleteMany({ where: { phone: { in: [NEW_PHONE, OTHER_PHONE] } } });

  beforeAll(async () => {
    prisma = testPrisma();
    await resetOtps(prisma);
    await cleanup();
    await prisma.otpCode.deleteMany({ where: { phone: { in: [NEW_PHONE, OTHER_PHONE] } } });
    app = await createApp();
    const depts = (await http().get('/api/v1/access/departments').expect(200)).body as {
      id: string;
      name: string;
    }[];
    ops = depts.find((d) => d.name === 'Operations')!;
    finance = depts.find((d) => d.name === 'Finance')!;
  });

  afterAll(async () => {
    await cleanup();
    await app.close();
    await prisma.$disconnect();
  });

  it('lists departments without signing in', () => {
    expect(ops).toBeTruthy();
    expect(finance).toBeTruthy();
  });

  it('saves a pending requester and tells their HOD', async () => {
    await http()
      .post('/api/v1/access/requests')
      .send({ name: 'Nina New', phone: '90000 00071', departmentId: ops.id })
      .expect(202, { received: true });

    const user = await prisma.user.findUniqueOrThrow({ where: { phone: NEW_PHONE } });
    expect(user).toMatchObject({ status: 'pending', roles: ['requester'], departmentId: ops.id });

    const hod = await prisma.user.findUniqueOrThrow({ where: { phone: PHONES.hodOps } });
    const note = await prisma.notification.findFirst({
      where: { userId: hod.id, template: 'access_requested' },
      orderBy: { createdAt: 'desc' },
    });
    expect(note?.channel).toBe('in_app');
  });

  it('answers the same for a number that is already registered', async () => {
    await http()
      .post('/api/v1/access/requests')
      .send({ name: 'Imposter', phone: PHONES.requester, departmentId: finance.id })
      .expect(202, { received: true });
    const user = await prisma.user.findUniqueOrThrow({ where: { phone: PHONES.requester } });
    expect(user.name).toBe('Rahul Requester');
  });

  it('shows the request only to that department’s HOD and admins', async () => {
    const hodOps = await login(app, PHONES.hodOps);
    const hodFinance = await login(app, PHONES.hodFinance);
    const manager = await login(app, PHONES.manager);
    const requester = await login(app, PHONES.requester);

    const forOps = await http()
      .get('/api/v1/access/requests')
      .set(bearer(hodOps.accessToken))
      .expect(200);
    expect(forOps.body.map((r: { phone: string }) => r.phone)).toContain(NEW_PHONE);

    const forFinance = await http()
      .get('/api/v1/access/requests')
      .set(bearer(hodFinance.accessToken))
      .expect(200);
    expect(forFinance.body.map((r: { phone: string }) => r.phone)).not.toContain(NEW_PHONE);

    const forManager = await http()
      .get('/api/v1/access/requests')
      .set(bearer(manager.accessToken))
      .expect(200);
    expect(forManager.body.map((r: { phone: string }) => r.phone)).toContain(NEW_PHONE);

    await http().get('/api/v1/access/requests').set(bearer(requester.accessToken)).expect(403);
  });

  it('lets the HOD approve, after which the person can log in', async () => {
    const pending = await prisma.user.findUniqueOrThrow({ where: { phone: NEW_PHONE } });
    const hodFinance = await login(app, PHONES.hodFinance);
    await http()
      .post(`/api/v1/access/requests/${pending.id}/approve`)
      .set(bearer(hodFinance.accessToken))
      .expect(403);

    const hodOps = await login(app, PHONES.hodOps);
    await http()
      .post(`/api/v1/access/requests/${pending.id}/approve`)
      .set(bearer(hodOps.accessToken))
      .expect(200);

    const session = await login(app, NEW_PHONE);
    expect(session.accessToken).toBeTruthy();
  });

  it('removes a declined request so the person can apply again', async () => {
    await http()
      .post('/api/v1/access/requests')
      .send({ name: 'Omar Other', phone: OTHER_PHONE, departmentId: finance.id })
      .expect(202);
    const pending = await prisma.user.findUniqueOrThrow({ where: { phone: OTHER_PHONE } });

    const admin = await login(app, PHONES.admin);
    await http()
      .post(`/api/v1/access/requests/${pending.id}/reject`)
      .set(bearer(admin.accessToken))
      .expect(204);
    expect(await prisma.user.findUnique({ where: { phone: OTHER_PHONE } })).toBeNull();
  });

  it('rejects a bad department or number', async () => {
    await http()
      .post('/api/v1/access/requests')
      .send({ name: 'Bad', phone: '12345', departmentId: ops.id })
      .expect(400);
    await http()
      .post('/api/v1/access/requests')
      .send({
        name: 'Bad',
        phone: OTHER_PHONE,
        departmentId: '00000000-0000-0000-0000-000000000000',
      })
      .expect(400);
  });
});
