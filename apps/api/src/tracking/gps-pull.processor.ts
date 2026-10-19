import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Queue } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { GpsIngestService } from './gps-ingest.service';
import { TrakzeeClient, toGpsPoint, vendorRegNo, type TrakzeeRow } from './vendor/trakzee';

export const GPS_PULL_QUEUE = 'gps-pull';
const SCHEDULER_ID = 'gps-pull';
/** Trackers the vendor reports that match no vehicle are remembered this long. */
const UNLINKED_TTL_S = 24 * 60 * 60;

/** A tracker on the vendor account that matches no PrismGo vehicle (yet). */
export interface UnlinkedTracker {
  imei: string;
  vehicleNo: string;
  lastSeen: string;
}

/**
 * Polls the GPS vendor's API (GPS_PULL_PROVIDER=trakzee) and feeds new fixes into the
 * same pipeline as the webhook. A BullMQ job scheduler runs it on one replica at a time.
 *
 * Trackers link themselves: the vendor reports each tracker's IMEI with the registration
 * number of the vehicle it is fitted to, so a vehicle entered in PrismGo without a GPS
 * device id gets it from the first matching row. Rows matching no vehicle are listed
 * for admins (see unlinked()).
 */
@Injectable()
@Processor(GPS_PULL_QUEUE)
export class GpsPullProcessor extends WorkerHost implements OnModuleInit {
  private readonly logger = new Logger(GpsPullProcessor.name);
  private readonly client: TrakzeeClient | null;
  private readonly intervalMs: number;
  /** Last fix time sent per device, so an unchanged position isn't processed again. */
  private readonly seenKey: string;
  private readonly unlinkedKey: string;
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
    this.unlinkedKey = `live:${db}:gps-pull:unlinked`;
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

  async process(): Promise<{ rows: number; sent: number; linked: number }> {
    if (!this.client) return { rows: 0, sent: 0, linked: 0 };
    const vehicles = await this.prisma.vehicle.findMany({
      where: { status: { not: 'inactive' } },
      select: { id: true, regNo: true, gpsDeviceId: true },
    });
    if (vehicles.length === 0) return { rows: 0, sent: 0, linked: 0 };

    let rows: TrakzeeRow[];
    try {
      rows = await this.client.live(
        vehicles.map((v) => ({ regNo: v.regNo, imei: v.gpsDeviceId ?? '' })),
      );
      if (this.failing) this.logger.log('GPS vendor reachable again');
      this.failing = false;
    } catch (err) {
      // Log once per outage, not every poll; the GPS-lost watchdog alerts managers.
      if (!this.failing) this.logger.error(`GPS vendor poll failed: ${(err as Error).message}`);
      this.failing = true;
      return { rows: 0, sent: 0, linked: 0 };
    }

    if (this.redis.status === 'wait') await this.redis.connect();
    const ours = new Set(vehicles.flatMap((v) => (v.gpsDeviceId ? [v.gpsDeviceId] : [])));
    const linked = await this.linkTrackers(rows, vehicles, ours);

    const seen = await this.redis.hgetall(this.seenKey);
    const points = rows
      .map((row) => toGpsPoint(row, this.client!.timeZone))
      .filter((p) => p !== null && ours.has(p.deviceId))
      .filter(
        (p) => !seen[p!.deviceId] || Date.parse(p!.recordedAt) > Date.parse(seen[p!.deviceId]!),
      )
      .map((p) => p!);
    if (points.length === 0) return { rows: rows.length, sent: 0, linked };

    await this.ingest.ingest(points);
    await this.redis.hset(
      this.seenKey,
      Object.fromEntries(points.map((p) => [p.deviceId, p.recordedAt])),
    );
    return { rows: rows.length, sent: points.length, linked };
  }

  /** Trackers on the vendor account that match no vehicle, newest first. */
  async unlinked(): Promise<UnlinkedTracker[]> {
    if (this.redis.status === 'wait') await this.redis.connect();
    const all = await this.redis.hgetall(this.unlinkedKey);
    const known = await this.prisma.vehicle.findMany({
      where: { gpsDeviceId: { in: Object.keys(all) } },
      select: { gpsDeviceId: true },
    });
    const linkedNow = new Set(known.map((v) => v.gpsDeviceId));
    return Object.values(all)
      .map((v) => JSON.parse(v) as UnlinkedTracker)
      .filter((t) => !linkedNow.has(t.imei))
      .sort((a, b) => b.lastSeen.localeCompare(a.lastSeen));
  }

  /**
   * Gives each unlinked vehicle the IMEI the vendor reports for its registration number;
   * remembers rows that match nothing. Adds newly linked IMEIs to `ours`.
   */
  private async linkTrackers(
    rows: TrakzeeRow[],
    vehicles: { id: string; regNo: string; gpsDeviceId: string | null }[],
    ours: Set<string>,
  ): Promise<number> {
    const waiting = new Map(
      vehicles.filter((v) => !v.gpsDeviceId).map((v) => [vendorRegNo(v.regNo), v]),
    );
    const unmatched: Record<string, string> = {};
    let linked = 0;
    for (const row of rows) {
      const imei = String(row['Imeino'] ?? '').trim();
      const vehicleNo = vendorRegNo(String(row['Vehicle_No'] ?? ''));
      if (!imei || imei === '--' || ours.has(imei)) continue;
      const vehicle = waiting.get(vehicleNo);
      if (!vehicle) {
        unmatched[imei] = JSON.stringify({
          imei,
          vehicleNo,
          lastSeen: new Date().toISOString(),
        } satisfies UnlinkedTracker);
        continue;
      }
      let count = 0;
      try {
        ({ count } = await this.prisma.vehicle.updateMany({
          where: { id: vehicle.id, gpsDeviceId: null },
          data: { gpsDeviceId: imei },
        }));
      } catch (err) {
        // The IMEI is already on another (e.g. inactive) vehicle: leave it to an admin.
        this.logger.warn(
          `Tracker ${imei} not linked to ${vehicle.regNo}: ${(err as Error).message}`,
        );
        continue;
      }
      if (count === 1) {
        ours.add(imei);
        waiting.delete(vehicleNo);
        linked++;
        this.logger.log(`Linked GPS tracker ${imei} to ${vehicle.regNo}`);
      }
    }
    if (Object.keys(unmatched).length > 0) {
      await this.redis.hset(this.unlinkedKey, unmatched);
      await this.redis.expire(this.unlinkedKey, UNLINKED_TTL_S);
    }
    return linked;
  }
}
