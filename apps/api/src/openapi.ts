/**
 * Writes openapi.json for client generation (the Flutter app's Dart client).
 * Run: pnpm --filter @prismgo/api openapi
 */
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { buildOpenApi, setupApp } from './setup-app';

async function run() {
  const app = await NestFactory.create(AppModule, { logger: false });
  setupApp(app);
  const out = resolve(__dirname, '..', 'openapi.json');
  writeFileSync(out, JSON.stringify(buildOpenApi(app), null, 2) + '\n');
  await app.close();
  console.log(`Wrote ${out}`);
}
void run();
