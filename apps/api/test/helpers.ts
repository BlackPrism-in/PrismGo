import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaPg } from '@prisma/adapter-pg';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaClient } from '../src/generated/prisma/client';
import { setupApp } from '../src/setup-app';

/** Seeded users (prisma/seed.ts). Needs pnpm db:up && pnpm db:seed. */
export const PHONES = {
  admin: '+919000000001',
  manager: '+919000000002',
  hodOps: '+919000000003',
  hodFinance: '+919000000004',
  requester: '+919000000005',
  requesterFinance: '+919000000006',
} as const;

export async function createApp(): Promise<INestApplication> {
  const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
  const app = moduleRef.createNestApplication();
  setupApp(app);
  await app.init();
  return app;
}

export function testPrisma(): PrismaClient {
  return new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env['DATABASE_URL'] }),
  });
}

/** Clears rate-limit history so repeated test runs can log in again. */
export async function resetOtps(prisma: PrismaClient): Promise<void> {
  await prisma.otpCode.deleteMany({ where: { phone: { in: Object.values(PHONES) } } });
}

export async function login(
  app: INestApplication,
  phone: string,
): Promise<{ accessToken: string; refreshToken: string }> {
  const server = app.getHttpServer();
  const otp = await request(server).post('/api/v1/auth/otp/request').send({ phone }).expect(200);
  const res = await request(server)
    .post('/api/v1/auth/otp/verify')
    .send({ phone, code: otp.body.devCode })
    .expect(200);
  return res.body;
}

/** Clears workflow data in the test database so each run starts with free vehicles. */
export async function resetWorkflow(prisma: PrismaClient): Promise<void> {
  await prisma.$transaction([
    prisma.tripEvent.deleteMany(),
    prisma.locationPoint.deleteMany(),
    prisma.trip.deleteMany(),
    prisma.approval.deleteMany(),
    prisma.tripRequest.deleteMany(),
    prisma.notification.deleteMany(),
  ]);
}

/** A date `days` from now at the given IST hour, as ISO. */
export function future(days: number, hourIst = 10): string {
  const d = new Date(Date.now() + days * 86_400_000);
  const ymd = d.toISOString().slice(0, 10);
  return new Date(`${ymd}T${String(hourIst).padStart(2, '0')}:00:00+05:30`).toISOString();
}
