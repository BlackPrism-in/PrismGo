import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import type { PrismaClient } from '../src/generated/prisma/client';
import { createApp, login, PHONES, resetOtps, testPrisma } from './helpers';

describe('auth', () => {
  let app: INestApplication;
  let prisma: PrismaClient;
  const http = () => request(app.getHttpServer());

  beforeAll(async () => {
    prisma = testPrisma();
    await resetOtps(prisma);
    app = await createApp();
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  beforeEach(() => resetOtps(prisma));

  it('logs in with phone + code and returns the profile', async () => {
    const otp = await http()
      .post('/api/v1/auth/otp/request')
      .send({ phone: '90000 00005' })
      .expect(200);
    expect(otp.body.sent).toBe(true);
    expect(otp.body.devCode).toMatch(/^\d{6}$/);

    const res = await http()
      .post('/api/v1/auth/otp/verify')
      .send({ phone: '9000000005', code: otp.body.devCode })
      .expect(200);
    expect(res.body.accessToken).toBeTruthy();
    expect(res.body.refreshToken).toBeTruthy();
    expect(res.body.user).toMatchObject({
      phone: PHONES.requester,
      roles: ['requester'],
      department: { name: 'Operations' },
    });

    const me = await http()
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${res.body.accessToken}`)
      .expect(200);
    expect(me.body.name).toBe('Rahul Requester');
  });

  it('signs up a new number on first login; after giving a name they can request a vehicle', async () => {
    const phone = '+919000000091';
    const removeUser = async () => {
      const u = await prisma.user.findUnique({ where: { phone } });
      if (!u) return;
      await prisma.tripRequest.deleteMany({ where: { requesterId: u.id } });
      await prisma.auditLog.deleteMany({ where: { actorId: u.id } });
      await prisma.notification.deleteMany({ where: { userId: u.id } });
      await prisma.user.delete({ where: { id: u.id } });
    };
    await removeUser();
    await prisma.otpCode.deleteMany({ where: { phone } });

    const otp = await http().post('/api/v1/auth/otp/request').send({ phone }).expect(200);
    expect(otp.body.devCode).toMatch(/^\d{6}$/);
    const login = await http()
      .post('/api/v1/auth/otp/verify')
      .send({ phone, code: otp.body.devCode })
      .expect(200);
    expect(login.body.user).toMatchObject({ name: '', roles: ['requester'], department: null });

    const done = await http()
      .patch('/api/v1/auth/me')
      .set('Authorization', `Bearer ${login.body.accessToken}`)
      .send({ name: 'Neha New', refreshToken: login.body.refreshToken })
      .expect(200);
    expect(done.body.user).toMatchObject({ name: 'Neha New', department: null });
    // The old refresh token was replaced.
    await http()
      .post('/api/v1/auth/refresh')
      .send({ refreshToken: login.body.refreshToken })
      .expect(401);

    // Admins are told someone joined.
    const admin = await prisma.user.findUniqueOrThrow({ where: { phone: PHONES.admin } });
    const note = await prisma.notification.findFirst({
      where: { userId: admin.id, template: 'new_user_joined' },
      orderBy: { createdAt: 'desc' },
    });
    expect(note?.payload).toMatchObject({ title: 'New user: Neha New' });

    // No department needed: the request goes straight to the HODs.
    const created = await http()
      .post('/api/v1/requests')
      .set('Authorization', `Bearer ${done.body.accessToken}`)
      .send({
        pickup: { address: 'Hill Cart Road', lat: 26.7, lng: 88.4 },
        drop: { address: 'Bagdogra Airport', lat: 26.6, lng: 88.3 },
        startAt: new Date(Date.now() + 86_400_000).toISOString(),
        passengers: 1,
        purpose: 'test',
      });
    expect(created.status).toBe(201);

    await prisma.notification.deleteMany({ where: { template: 'new_user_joined' } });
    await removeUser();
  });

  it('sends nothing to a deactivated user but answers the same', async () => {
    const phone = '+919000000092';
    await prisma.user.deleteMany({ where: { phone } });
    const org = await prisma.organisation.findFirstOrThrow();
    await prisma.user.create({
      data: { orgId: org.id, name: 'Gone', phone, roles: ['requester'], status: 'inactive' },
    });
    const res = await http().post('/api/v1/auth/otp/request').send({ phone }).expect(200);
    expect(res.body).toEqual({ sent: true });
    await prisma.user.deleteMany({ where: { phone } });
  });

  it('rejects an invalid number format', async () => {
    await http().post('/api/v1/auth/otp/request').send({ phone: '12345' }).expect(400);
  });

  it('rejects a wrong code and locks the code after 5 attempts', async () => {
    const otp = await http()
      .post('/api/v1/auth/otp/request')
      .send({ phone: PHONES.requester })
      .expect(200);
    const wrong = otp.body.devCode === '000000' ? '111111' : '000000';
    for (let i = 0; i < 5; i++) {
      await http()
        .post('/api/v1/auth/otp/verify')
        .send({ phone: PHONES.requester, code: wrong })
        .expect(401);
    }
    const locked = await http()
      .post('/api/v1/auth/otp/verify')
      .send({ phone: PHONES.requester, code: otp.body.devCode })
      .expect(401);
    expect(locked.body.message).toBe('Code expired. Request a new one.');
  });

  it('limits codes to 3 per number per 10 minutes', async () => {
    for (let i = 0; i < 3; i++) {
      await http().post('/api/v1/auth/otp/request').send({ phone: PHONES.hodOps }).expect(200);
    }
    await http().post('/api/v1/auth/otp/request').send({ phone: PHONES.hodOps }).expect(429);
  });

  it('requires a token on protected routes', async () => {
    await http().get('/api/v1/auth/me').expect(401);
    await http().get('/api/v1/auth/me').set('Authorization', 'Bearer nope').expect(401);
  });

  it('rotates refresh tokens and revokes everything when an old one is reused', async () => {
    const first = await login(app, PHONES.manager);
    const rotated = await http()
      .post('/api/v1/auth/refresh')
      .send({ refreshToken: first.refreshToken })
      .expect(200);
    expect(rotated.body.refreshToken).not.toBe(first.refreshToken);

    // Replaying the old token looks like theft: it fails and kills the new one too.
    await http()
      .post('/api/v1/auth/refresh')
      .send({ refreshToken: first.refreshToken })
      .expect(401);
    await http()
      .post('/api/v1/auth/refresh')
      .send({ refreshToken: rotated.body.refreshToken })
      .expect(401);
  });

  it('gives web clients the refresh token as an httpOnly cookie', async () => {
    const otp = await http()
      .post('/api/v1/auth/otp/request')
      .send({ phone: PHONES.admin })
      .expect(200);
    const res = await http()
      .post('/api/v1/auth/otp/verify')
      .set('X-Client', 'web')
      .send({ phone: PHONES.admin, code: otp.body.devCode })
      .expect(200);
    expect(res.body.refreshToken).toBeUndefined();
    const cookie = res.headers['set-cookie']?.[0] ?? '';
    expect(cookie).toMatch(/^pg_rt=/);
    expect(cookie).toContain('HttpOnly');
    expect(cookie).toContain('Path=/api/v1/auth');

    const refreshed = await http()
      .post('/api/v1/auth/refresh')
      .set('X-Client', 'web')
      .set('Cookie', cookie.split(';')[0]!)
      .expect(200);
    expect(refreshed.body.accessToken).toBeTruthy();

    await http()
      .post('/api/v1/auth/logout')
      .set('Cookie', refreshed.headers['set-cookie']![0]!.split(';')[0]!)
      .expect(204);
  });
});
