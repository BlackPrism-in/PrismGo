import { getQueueToken } from '@nestjs/bullmq';
import { INestApplication } from '@nestjs/common';
import type { Job, Queue } from 'bullmq';
import request from 'supertest';
import type { PrismaClient } from '../src/generated/prisma/client';
import { PUSH_QUEUE, PushProcessor, type PushJob } from '../src/notifications/push.processor';
import { createApp, future, login, PHONES, resetOtps, resetWorkflow, testPrisma } from './helpers';

describe('Mobile push', () => {
  let app: INestApplication;
  let prisma: PrismaClient;
  let queue: Queue<PushJob>;
  const t: Record<string, string> = {};
  const http = () => request(app.getHttpServer());
  const as = (who: string) => ({ Authorization: `Bearer ${t[who]}` });
  const hodToken = 'fcm-token-hod-device-0123456789';

  beforeAll(async () => {
    prisma = testPrisma();
    await resetOtps(prisma);
    await resetWorkflow(prisma);
    await prisma.deviceToken.deleteMany({});
    app = await createApp();
    queue = app.get<Queue<PushJob>>(getQueueToken(PUSH_QUEUE));
    await queue.obliterate({ force: true });
    for (const k of ['requester', 'hodOps'] as const)
      t[k] = (await login(app, PHONES[k])).accessToken;
  });

  afterAll(async () => {
    await prisma.deviceToken.deleteMany({});
    await app.close();
    await prisma.$disconnect();
  });

  it('registers a device, validates input and moves a token to the new user', async () => {
    await http()
      .post('/api/v1/devices')
      .set(as('hodOps'))
      .send({ token: 'short', platform: 'android' })
      .expect(400);
    await http()
      .post('/api/v1/devices')
      .set(as('hodOps'))
      .send({ token: hodToken, platform: 'windows' })
      .expect(400);
    await http()
      .post('/api/v1/devices')
      .set(as('requester'))
      .send({ token: hodToken, platform: 'android' })
      .expect(204);
    await http()
      .post('/api/v1/devices')
      .set(as('hodOps'))
      .send({ token: hodToken, platform: 'android' })
      .expect(204);
    const row = await prisma.deviceToken.findUniqueOrThrow({ where: { token: hodToken } });
    const hod = await prisma.user.findUniqueOrThrow({ where: { phone: PHONES.hodOps } });
    expect(row.userId).toBe(hod.id);
  });

  it('pushes a workflow notification to the recipient’s device', async () => {
    const r = await http()
      .post('/api/v1/requests')
      .set(as('requester'))
      .send({
        pickup: { address: 'Office', lat: 12.9756, lng: 77.6066 },
        drop: { address: 'Airport', lat: 13.1989, lng: 77.7068 },
        startAt: future(2),
        passengers: 1,
        purpose: 'Client visit',
      })
      .expect(201);

    const jobs = await queue.getJobs(['waiting', 'active', 'completed', 'delayed']);
    const job = jobs.find((j) => j.data.token === hodToken);
    expect(job?.data.message).toMatchObject({
      title: expect.stringContaining(r.body.code),
      data: { template: 'request_submitted', requestId: r.body.id },
    });
  });

  it('drops a token the push service no longer knows', async () => {
    const processor = app.get(PushProcessor);
    Object.assign(processor, { sender: { name: 'stub', send: async () => 'invalid-token' } });
    await processor.process({
      data: { token: hodToken, message: { title: 'x', body: 'y', data: {} } },
    } as Job<PushJob>);
    expect(await prisma.deviceToken.count({ where: { token: hodToken } })).toBe(0);
  });

  it('only removes the signed-in user’s own token on logout', async () => {
    await http()
      .post('/api/v1/devices')
      .set(as('hodOps'))
      .send({ token: hodToken, platform: 'android' })
      .expect(204);
    await http().delete(`/api/v1/devices/${hodToken}`).set(as('requester')).expect(204);
    expect(await prisma.deviceToken.count({ where: { token: hodToken } })).toBe(1);
    await http().delete(`/api/v1/devices/${hodToken}`).set(as('hodOps')).expect(204);
    expect(await prisma.deviceToken.count({ where: { token: hodToken } })).toBe(0);
  });
});
