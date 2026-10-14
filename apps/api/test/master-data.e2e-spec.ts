import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import type { PrismaClient } from '../src/generated/prisma/client';
import { createApp, login, PHONES, resetOtps, testPrisma } from './helpers';

const suffix = Date.now().toString().slice(-6);

describe('master data', () => {
  let app: INestApplication;
  let prisma: PrismaClient;
  let manager: string;
  let requester: string;
  const http = () => request(app.getHttpServer());

  beforeAll(async () => {
    prisma = testPrisma();
    await resetOtps(prisma);
    app = await createApp();
    manager = (await login(app, PHONES.manager)).accessToken;
    requester = (await login(app, PHONES.requester)).accessToken;
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  it('lets any signed-in user list departments', async () => {
    const res = await http()
      .get('/api/v1/departments')
      .set('Authorization', `Bearer ${requester}`)
      .expect(200);
    expect(res.body.map((d: { name: string }) => d.name)).toEqual(
      expect.arrayContaining(['Finance', 'Operations']),
    );
  });

  it('blocks requesters from master data changes', async () => {
    await http().get('/api/v1/vehicles').set('Authorization', `Bearer ${requester}`).expect(403);
    await http().get('/api/v1/users').set('Authorization', `Bearer ${requester}`).expect(403);
    await http()
      .post('/api/v1/departments')
      .set('Authorization', `Bearer ${requester}`)
      .send({ name: 'Nope' })
      .expect(403);
  });

  it('creates and updates a vehicle, normalising the reg number', async () => {
    const created = await http()
      .post('/api/v1/vehicles')
      .set('Authorization', `Bearer ${manager}`)
      .send({ regNo: `ka 05 mn ${suffix.slice(-4)}`, type: 'Hatchback', seats: 4 })
      .expect(201);
    expect(created.body.regNo).toBe(`KA05MN${suffix.slice(-4)}`);
    expect(created.body.status).toBe('available');

    const updated = await http()
      .patch(`/api/v1/vehicles/${created.body.id}`)
      .set('Authorization', `Bearer ${manager}`)
      .send({ status: 'maintenance' })
      .expect(200);
    expect(updated.body.status).toBe('maintenance');

    const audit = await prisma.auditLog.findMany({ where: { entityId: created.body.id } });
    expect(audit.map((a) => a.action).sort()).toEqual(['create', 'update']);
  });

  it('rejects duplicate reg numbers with 409', async () => {
    await http()
      .post('/api/v1/vehicles')
      .set('Authorization', `Bearer ${manager}`)
      .send({ regNo: 'KA01AB1001', type: 'Sedan', seats: 4 })
      .expect(409);
  });

  it('creates a user, rejects a duplicate phone, and assigns them as HOD', async () => {
    const phone = `98${suffix}11`;
    const dept = await http()
      .post('/api/v1/departments')
      .set('Authorization', `Bearer ${manager}`)
      .send({ name: `Dept ${suffix}` })
      .expect(201);

    const user = await http()
      .post('/api/v1/users')
      .set('Authorization', `Bearer ${manager}`)
      .send({ name: 'New HOD', phone, roles: ['hod', 'requester'], departmentId: dept.body.id })
      .expect(201);
    expect(user.body.phone).toBe(`+91${phone}`);

    await http()
      .post('/api/v1/users')
      .set('Authorization', `Bearer ${manager}`)
      .send({ name: 'Dup', phone, roles: ['requester'] })
      .expect(409);

    const withHod = await http()
      .patch(`/api/v1/departments/${dept.body.id}`)
      .set('Authorization', `Bearer ${manager}`)
      .send({ hodUserId: user.body.id })
      .expect(200);
    expect(withHod.body.hod.name).toBe('New HOD');

    // Removing the HOD role clears them as head of the department.
    await http()
      .patch(`/api/v1/users/${user.body.id}`)
      .set('Authorization', `Bearer ${manager}`)
      .send({ roles: ['requester'] })
      .expect(200);
    const depts = await http()
      .get('/api/v1/departments')
      .set('Authorization', `Bearer ${manager}`)
      .expect(200);
    expect(depts.body.find((d: { id: string }) => d.id === dept.body.id).hod).toBeNull();
  });

  it('refuses to make a non-HOD user head of a department', async () => {
    const depts = await http()
      .get('/api/v1/departments')
      .set('Authorization', `Bearer ${manager}`)
      .expect(200);
    const requesterUser = await prisma.user.findUniqueOrThrow({
      where: { phone: PHONES.requester },
    });
    await http()
      .patch(`/api/v1/departments/${depts.body[0].id}`)
      .set('Authorization', `Bearer ${manager}`)
      .send({ hodUserId: requesterUser.id })
      .expect(400);
  });

  it('rejects unknown fields', async () => {
    await http()
      .post('/api/v1/vehicles')
      .set('Authorization', `Bearer ${manager}`)
      .send({ regNo: 'KA01ZZ0001', type: 'Sedan', seats: 4, orgId: 'someone-else' })
      .expect(400);
  });
});
