import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { afterAll, beforeAll, expect, it, vi } from 'vitest';
import type { PrismaClient } from '../src/generated/prisma/client';
import { RedisService } from '../src/redis/redis.service';
import { createApp, login, PHONES, resetOtps, testPrisma } from './helpers';

let app: INestApplication;
let prisma: PrismaClient;
let token: string;
const realFetch = globalThis.fetch;

const photon = (features: unknown[]) => new Response(JSON.stringify({ features }), { status: 200 });
const feature = (props: Record<string, string>, lat: number, lng: number) => ({
  geometry: { coordinates: [lng, lat] },
  properties: props,
});

beforeAll(async () => {
  prisma = testPrisma();
  await resetOtps(prisma);
  app = await createApp();
  token = (await login(app, PHONES.requester)).accessToken;
  await app.get(RedisService).del('places:hill cart', 'places:nowhere at all');
});

afterAll(async () => {
  vi.restoreAllMocks();
  await app.close();
  await prisma.$disconnect();
});

it('suggests Indian addresses with coordinates, and caches them', async () => {
  const spy = vi.spyOn(globalThis, 'fetch').mockImplementation(async (input, init) => {
    if (!String(input).includes('photon')) return realFetch(input, init);
    return photon([
      feature(
        { name: 'Hill Cart Road', city: 'Siliguri', state: 'West Bengal', countrycode: 'IN' },
        26.7191,
        88.4204,
      ),
      feature({ name: 'Hill Cart Road', city: 'Kathmandu', countrycode: 'NP' }, 27.7, 85.3),
    ]);
  });

  const res = await request(app.getHttpServer())
    .get('/api/v1/places/search?q=Hill%20Cart')
    .set('Authorization', `Bearer ${token}`)
    .expect(200);
  expect(res.body).toEqual([
    { address: 'Hill Cart Road, Siliguri, West Bengal', lat: 26.7191, lng: 88.4204 },
  ]);

  await request(app.getHttpServer())
    .get('/api/v1/places/search?q=hill%20cart')
    .set('Authorization', `Bearer ${token}`)
    .expect(200);
  expect(spy.mock.calls.filter(([u]) => String(u).includes('photon'))).toHaveLength(1);
  spy.mockRestore();
});

it('explains when the search service is down', async () => {
  const spy = vi.spyOn(globalThis, 'fetch').mockImplementation(async (input, init) => {
    if (!String(input).includes('photon')) return realFetch(input, init);
    return new Response('down', { status: 503 });
  });
  const res = await request(app.getHttpServer())
    .get('/api/v1/places/search?q=Nowhere%20at%20all')
    .set('Authorization', `Bearer ${token}`)
    .expect(424);
  expect(res.body.message).toMatch(/not available/);
  spy.mockRestore();
});

it('needs at least 3 characters and a login', async () => {
  await request(app.getHttpServer())
    .get('/api/v1/places/search?q=ab')
    .set('Authorization', `Bearer ${token}`)
    .expect(400);
  await request(app.getHttpServer()).get('/api/v1/places/search?q=abc').expect(401);
});
