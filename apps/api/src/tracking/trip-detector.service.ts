import { Injectable, Logger } from '@nestjs/common';
import { distanceM } from '@prismgo/shared';
import { PrismaService } from '../prisma/prisma.service';
import { LiveStateService, type LivePosition } from './live-state.service';
import { TripLifecycleService } from './trip-lifecycle.service';

/** A scheduled trip is considered from this long before pickup time… */
const WINDOW_BEFORE_MS = 60 * 60 * 1000;
/** …until this long after its booked end. */
const WINDOW_AFTER_MS = 60 * 60 * 1000;
const DEFAULT_RADIUS_M = 150;
/** Leaving must clear 1.5× the radius, so GPS jitter at the gate doesn't start a trip. */
const EXIT_FACTOR = 1.5;

/**
 * Starts and ends trips from tracker data:
 *  - start: the vehicle was inside the pickup geofence, then leaves it;
 *  - end (one way): it enters the drop geofence;
 *  - end (with return): it reaches the drop, then comes back to the pickup.
 * Managers can always start or end a trip by hand.
 */
@Injectable()
export class TripDetectorService {
  private readonly logger = new Logger(TripDetectorService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly live: LiveStateService,
    private readonly lifecycle: TripLifecycleService,
  ) {}

  /** `points` are one vehicle's new points, oldest first. */
  async process(orgId: string, vehicleId: string, points: LivePosition[]): Promise<void> {
    if (points.length === 0) return;
    const org = await this.prisma.organisation.findUnique({ where: { id: orgId } });
    const radius =
      Number((org?.settings as { geofenceRadiusM?: number } | null)?.geofenceRadiusM) ||
      DEFAULT_RADIUS_M;

    for (const p of points) {
      const at = new Date(p.recordedAt);
      const trip = await this.candidateTrip(vehicleId, at);
      if (!trip) continue;

      const state = await this.live.tripState(trip.id);
      const pickup = { lat: trip.request.pickupLat, lng: trip.request.pickupLng };
      const drop = { lat: trip.request.dropLat, lng: trip.request.dropLng };
      const toPickup = distanceM(p, pickup);
      const toDrop = distanceM(p, drop);
      let changed = false;

      if (state.gpsLostAlerted) {
        state.gpsLostAlerted = false;
        changed = true;
      }

      try {
        if (trip.status === 'scheduled') {
          if (toPickup <= radius && !state.seenAtPickup) {
            state.seenAtPickup = true;
            changed = true;
          } else if (state.seenAtPickup && toPickup > radius * EXIT_FACTOR) {
            await this.lifecycle.start(trip.id, { source: 'tracker', at, position: p });
            continue;
          }
        } else if (!trip.request.returnAt) {
          if (toDrop <= radius) {
            await this.lifecycle.end(trip.id, { source: 'tracker', at, position: p });
            continue;
          }
        } else {
          if (toDrop <= radius && !state.seenAtDrop) {
            state.seenAtDrop = true;
            changed = true;
            await this.prisma.tripEvent.create({
              data: {
                tripId: trip.id,
                type: 'dropped',
                source: 'tracker',
                at,
                lat: p.lat,
                lng: p.lng,
              },
            });
          } else if (state.seenAtDrop && toPickup <= radius) {
            await this.lifecycle.end(trip.id, { source: 'tracker', at, position: p });
            continue;
          }
        }
      } catch (err) {
        // A concurrent manual override or a cancelled request: log and move on.
        this.logger.warn(`Detector on trip ${trip.id}: ${(err as Error).message}`);
      }

      if (changed) await this.live.setTripState(trip.id, state);
    }
  }

  /** The trip this point belongs to: the one in progress, else the next scheduled in its window. */
  private async candidateTrip(vehicleId: string, at: Date) {
    const include = {
      request: {
        select: { pickupLat: true, pickupLng: true, dropLat: true, dropLng: true, returnAt: true },
      },
    } as const;
    const running = await this.prisma.trip.findFirst({
      where: { vehicleId, status: 'in_progress' },
      include,
    });
    if (running) return running;
    return this.prisma.trip.findFirst({
      where: {
        vehicleId,
        status: 'scheduled',
        scheduledStart: { lte: new Date(at.getTime() + WINDOW_BEFORE_MS) },
        scheduledEnd: { gte: new Date(at.getTime() - WINDOW_AFTER_MS) },
      },
      orderBy: { scheduledStart: 'asc' },
      include,
    });
  }
}
