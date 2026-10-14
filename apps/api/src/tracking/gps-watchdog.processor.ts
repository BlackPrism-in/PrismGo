import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import type { Queue } from 'bullmq';
import { messages } from '../notifications/messages';
import { NotificationsService } from '../notifications/notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import { factsOf, RequestsService } from '../requests/requests.service';
import { LiveStateService } from './live-state.service';

export const TRACKING_QUEUE = 'tracking';
const LOST_AFTER_MS = 5 * 60 * 1000;

/** Every minute: alert transport once when a running trip stops sending GPS. */
@Injectable()
@Processor(TRACKING_QUEUE)
export class GpsWatchdogProcessor extends WorkerHost implements OnModuleInit {
  private readonly logger = new Logger(GpsWatchdogProcessor.name);

  constructor(
    @InjectQueue(TRACKING_QUEUE) private readonly queue: Queue,
    private readonly prisma: PrismaService,
    private readonly live: LiveStateService,
    private readonly requests: RequestsService,
    private readonly notifications: NotificationsService,
  ) {
    super();
  }

  async onModuleInit(): Promise<void> {
    await this.queue.upsertJobScheduler(
      'gps-watchdog',
      { every: 60_000 },
      { name: 'gps-watchdog' },
    );
  }

  async process(): Promise<void> {
    const trips = await this.prisma.trip.findMany({
      where: { status: 'in_progress' },
      include: { vehicle: true },
    });
    const now = Date.now();
    for (const trip of trips) {
      const state = await this.live.tripState(trip.id);
      if (state.gpsLostAlerted) continue;
      const latest = await this.live.latest(trip.orgId, trip.vehicleId);
      const lastSeen = Math.max(
        latest ? Date.parse(latest.recordedAt) : 0,
        (trip.actualStart ?? trip.scheduledStart).getTime(),
      );
      if (now - lastSeen < LOST_AFTER_MS) continue;

      const minutes = Math.round((now - lastSeen) / 60_000);
      await this.prisma.tripEvent.create({
        data: {
          tripId: trip.id,
          type: 'gps_lost',
          source: 'system',
          note: `No GPS for ${minutes} min`,
        },
      });
      await this.live.setTripState(trip.id, { ...state, gpsLostAlerted: true });
      const r = await this.requests.load(trip.orgId, trip.requestId);
      await this.notifications.notify(
        trip.orgId,
        await this.requests.managers(trip.orgId),
        messages.gpsLost(factsOf(r), trip.vehicle.regNo, minutes),
        { requestId: r.id },
      );
      this.logger.warn(`GPS lost on trip ${trip.id} (${trip.vehicle.regNo}) for ${minutes} min`);
    }
  }
}
