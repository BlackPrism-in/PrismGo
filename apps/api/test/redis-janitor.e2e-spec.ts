import { INestApplication } from '@nestjs/common';
import { afterAll, beforeAll, expect, it } from 'vitest';
import { RedisJanitorService } from '../src/redis/redis-janitor.service';
import { RedisService } from '../src/redis/redis.service';
import { createApp } from './helpers';

let app: INestApplication;
let redis: RedisService;
const db = new URL(process.env['DATABASE_URL']!).pathname.slice(1);

beforeAll(async () => {
  app = await createApp();
  redis = app.get(RedisService);
});

afterAll(async () => {
  await redis.del(`prismgo:${db}:janitor-test`, `live:${db}:janitor-test`);
  await app.close();
});

it('removes queue and live keys of other databases, keeps the current one', async () => {
  await redis.set('prismgo:old_db_janitor:outbox:1', 'x');
  await redis.set('live:old_db_janitor:latest', 'x');
  await redis.set(`prismgo:${db}:janitor-test`, 'keep');
  await redis.set(`live:${db}:janitor-test`, 'keep');
  await redis.set('places:janitor test', 'keep');

  const removed = await app.get(RedisJanitorService).removeStaleNamespaces();

  expect(removed).toBeGreaterThanOrEqual(2);
  expect(await redis.exists('prismgo:old_db_janitor:outbox:1', 'live:old_db_janitor:latest')).toBe(
    0,
  );
  expect(await redis.get(`prismgo:${db}:janitor-test`)).toBe('keep');
  expect(await redis.get(`live:${db}:janitor-test`)).toBe('keep');
  expect(await redis.get('places:janitor test')).toBe('keep');
  await redis.del('places:janitor test');
});
