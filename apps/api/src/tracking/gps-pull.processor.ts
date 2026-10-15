import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Queue } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { GpsIngestService } from './gps-ingest.service';
import { TrakzeeClient, toGpsPoint } from './vendor/trakzee';

export const GPS_PULL_QUEUE = 'gps-pull';
const SCHEDULER_ID = 'gps-pull';

/**
 * Polls the GPS vendor's API (GPS_PULL_PROVIDER=trakzee) and feeds new fixes into the
 * same pipeline as the webhook. A BullMQ job scheduler runs it on one replica at a time.
 */
@Injectable()
@Processor(GPS_PULL_QUEUE)
export class GpsPullProcessor extends WorkerHost implements OnModuleInit {
  private readonly logger = new Logger(GpsPullProcessor.name);
  private readonly client: TrakzeeClient | null;
  private readonly intervalMs: number;
  /** Last fix time sent per device, so an unchanged position isn't processed again. */
  private readonly seenKey: string;
  private failing = false;

  constructor(
    @InjectQueue(GPS_PULL_QUEUE) private readonly queue: Queue,
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly ingest: GpsIngestService,
    config: ConfigService,
  ) {
    super();
    const get = (key: string) => config.get<string>(key)?.trim() ?? '';
    this.intervalMs = Math.max(5, Number(get('GPS_PULL_INTERVAL_S')) || 15) * 1000;
    this.client =
      get('GPS_PULL_PROVIDER') === 'trakzee'
        ? new TrakzeeClient({
            baseUrl: get('GPS_VENDOR_BASE_URL'),
            username: get('GPS_VENDOR_USERNAME'),
            password: get('GPS_VENDOR_PASSWORD'),
            projectId: get('GPS_VENDOR_PROJECT_ID'),
            company: get('GPS_VENDOR_COMPANY'),
            timeZone: get('GPS_VENDOR_TIME_ZONE') || '+05:30',
          })
        : null;
    const db = new URL(config.getOrThrow<string>('DATABASE_URL')).pathname.slice(1);
    this.seenKey = `live:${db}:gps-pull:seen`;
  }

  async onModuleInit(): Promise<void> {
    if (this.client) {
      await this.queue.upsertJobScheduler(
        SCHEDULER_ID,
        { every: this.intervalMs },
        { name: SCHEDULER_ID, opts: { removeOnComplete: true, removeOnFail: 100 } },
      );
      this.logger.log(`Polling the GPS vendor every ${this.intervalMs / 1000}s`);
    } else {
      await this.queue.removeJobScheduler(SCHEDULER_ID);
    }
  }

  async process(): Promise<{ rows: number; sent: number }> {
    if (!this.client) return { rows: 0, sent: 0 };
    const vehicles = await this.prisma.vehicle.findMany({
      where: { gpsDeviceId: { not: null }, status: { not: 'inactive' } },
      select: { regNo: true, gpsDeviceId: true },
    });
    if (vehicles.length === 0) return { rows: 0, sent: 0 };

    let rows;
    try {
      rows = await this.client.live(
        vehicles.map((v) => ({ regNo: v.regNo, imei: v.gpsDeviceId! })),
      );
      if (this.failing) this.logger.log('GPS vendor reachable again');
      this.failing = false;
    } catch (err) {
      // Log once per outage, not every poll; the GPS-lost watchdog alerts managers.
      if (!this.failing) this.logger.error(`GPS vendor poll failed: ${(err as Error).message}`);
      this.failing = true;
      return { rows: 0, sent: 0 };
    }

    if (this.redis.status === 'wait') await this.redis.connect();
    // The vendor may return every vehicle on the account; keep only ours.
    const ours = new Set(vehicles.map((v) => v.gpsDeviceId!));
    const seen = await this.redis.hgetall(this.seenKey);
    const points = rows
      .map((row) => toGpsPoint(row, this.client!.timeZone))
      .filter((p) => p !== null && ours.has(p.deviceId))
      .filter(
        (p) => !seen[p!.deviceId] || Date.parse(p!.recordedAt) > Date.parse(seen[p!.deviceId]!),
      )
      .map((p) => p!);
    if (points.length === 0) return { rows: rows.length, sent: 0 };

    await this.ingest.ingest(points);
    await this.redis.hset(
      this.seenKey,
      Object.fromEntries(points.map((p) => [p.deviceId, p.recordedAt])),
    );
    return { rows: rows.length, sent: points.length };
  }
}
