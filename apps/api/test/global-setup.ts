/**
 * Runs once before the e2e suite: creates the separate test database (so tests never
 * touch dev data), applies migrations and seeds it.
 */
import { execSync } from 'node:child_process';
import { Client } from 'pg';
import { testDatabaseUrl } from './test-db';

export default async function setup(): Promise<void> {
  const url = testDatabaseUrl();
  const dbName = new URL(url).pathname.slice(1);
  const admin = new Client({ connectionString: url.replace(`/${dbName}`, '/postgres') });
  await admin.connect();
  const exists = await admin.query('SELECT 1 FROM pg_database WHERE datname = $1', [dbName]);
  if (exists.rowCount === 0) await admin.query(`CREATE DATABASE "${dbName}"`);
  await admin.end();

  const env = { ...process.env, DATABASE_URL: url };
  execSync('pnpm prisma migrate deploy', { env, stdio: 'ignore' });
  execSync('pnpm tsx prisma/seed.ts', { env, stdio: 'ignore' });
}
