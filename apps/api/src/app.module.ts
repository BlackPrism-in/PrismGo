import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AssignmentsModule } from './assignments/assignments.module';
import { AuditModule } from './audit/audit.module';
import { AuthModule } from './auth/auth.module';
import { validateEnv } from './config/env';
import { DepartmentsModule } from './departments/departments.module';
import { DriversModule } from './drivers/drivers.module';
import { HealthModule } from './health/health.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PrismaModule } from './prisma/prisma.module';
import { RealtimeModule } from './realtime/realtime.module';
import { RedisModule } from './redis/redis.module';
import { RequestsModule } from './requests/requests.module';
import { TrackingModule } from './tracking/tracking.module';
import { UsersModule } from './users/users.module';
import { VehiclesModule } from './vehicles/vehicles.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnv }),
    // Default: 120 requests/minute per IP. Login endpoints set tighter limits.
    // THROTTLE_DISABLED=true only in automated tests (every request shares one IP).
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 60_000, limit: 120 }],
      skipIf: () => process.env['THROTTLE_DISABLED'] === 'true',
    }),
    PrismaModule,
    RedisModule,
    AuditModule,
    AuthModule,
    HealthModule,
    DepartmentsModule,
    UsersModule,
    VehiclesModule,
    DriversModule,
    RealtimeModule,
    NotificationsModule,
    RequestsModule,
    AssignmentsModule,
    TrackingModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
