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

  it('answers the same for unknown numbers and sends nothing', async () => {
    const res = await http()
      .post('/api/v1/auth/otp/request')
      .send({ phone: '9999999999' })
      .expect(200);
    expect(res.body).toEqual({ sent: true });
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
