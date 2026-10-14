import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { distanceM, estimateMinutes, type LatLng } from '@prismgo/shared';
import { AuditService } from '../audit/audit.service';
import type { AuthUser } from '../auth/auth.types';
import { messages } from '../notifications/messages';
import { NotificationsService } from '../notifications/notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import { factsOf, RequestsService } from '../requests/requests.service';
import { LiveStateService, type LivePosition } from './live-state.service';

export type TripSource = 'tracker' | 'manager';

interface Change {
  source: TripSource;
  /** Who pressed the button (manager override); absent for the tracker. */
  actor?: AuthUser;
  at: Date;
  position?: Pick<LivePosition, 'lat' | 'lng' | 'odometerKm'> | null;
}

/**
 * Starts and ends trips. The trip detector calls this from GPS data; managers call
 * it to override. Both paths update the trip, its request and the vehicle together,
 * then notify people.
 */
@Injectable()
export class TripLifecycleService {
  private readonly logger = new Logger(TripLifecycleService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly requests: RequestsService,
    private readonly audit: AuditService,
    private readonly notifications: NotificationsService,
    private readonly live: LiveStateService,
  ) {}

  async start(tripId: string, change: Change): Promise<void> {
    const trip = await this.prisma.trip.findUnique({
      where: { id: tripId },
      include: { request: true, vehicle: true },
    });
    if (!trip) throw new NotFoundException('Trip not found');
    if (trip.status !== 'scheduled') {
      throw new ConflictException(`Trip is already ${trip.status.replace('_', ' ')}`);
    }
    this.requests.transition(trip.request.status, 'start');

    await this.prisma.$transaction(async (tx) => {
      const { count } = await tx.trip.updateMany({
        where: { id: tripId, status: 'scheduled' },
        data: {
          status: 'in_progress',
          actualStart: change.at,
          startOdometerKm: change.position?.odometerKm ?? null,
        },
      });
      if (count === 0) throw new ConflictException('Trip was just changed');
      await this.requests.guardedUpdate(tx, trip.request, { status: 'in_progress' });
      await tx.vehicle.update({ where: { id: trip.vehicleId }, data: { status: 'on_trip' } });
      await tx.tripEvent.create({
        data: {
          tripId,
          type: 'started',
          source: change.source,
          actorId: change.actor?.id ?? null,
          at: change.at,
          lat: change.position?.lat ?? null,
          lng: change.position?.lng ?? null,
        },
      });
      if (change.actor) {
        await this.audit.record(tx, change.actor, {
          entity: 'trip',
          entityId: tripId,
          action: 'start_manual',
        });
      }
    });

    const r = await this.requests.load(trip.orgId, trip.requestId);
    const from: LatLng = change.position ?? { lat: r.pickupLat, lng: r.pickupLng };
    const eta = estimateMinutes(from, { lat: r.dropLat, lng: r.dropLng });
    await this.notifications.notify(
      trip.orgId,
      [{ userId: r.requesterId }],
      messages.tripStarted(factsOf(r), trip.vehicle.regNo, eta),
      { requestId: r.id },
    );
    this.requests.broadcast(this.systemActor(trip.orgId), r);
    this.logger.log(`Trip ${tripId} started (${change.source})`);
  }

  async end(tripId: string, change: Change): Promise<void> {
    const trip = await this.prisma.trip.findUnique({
      where: { id: tripId },
      include: { request: true, vehicle: true },
    });
    if (!trip) throw new NotFoundException('Trip not found');
    if (trip.status !== 'in_progress') {
      throw new ConflictException('Only a trip in progress can be ended');
    }
    this.requests.transition(trip.request.status, 'complete');

    const endOdo = change.position?.odometerKm ?? null;
    const distanceKm =
      trip.startOdometerKm != null && endOdo != null && endOdo >= trip.startOdometerKm
        ? endOdo - trip.startOdometerKm
        : await this.pathDistanceKm(
            trip.vehicleId,
            trip.actualStart ?? trip.scheduledStart,
            change.at,
          );

    await this.prisma.$transaction(async (tx) => {
      const { count } = await tx.trip.updateMany({
        where: { id: tripId, status: 'in_progress' },
        data: { status: 'completed', actualEnd: change.at, endOdometerKm: endOdo, distanceKm },
      });
      if (count === 0) throw new ConflictException('Trip was just changed');
      await this.requests.guardedUpdate(tx, trip.request, { status: 'completed' });
      await tx.vehicle.update({ where: { id: trip.vehicleId }, data: { status: 'available' } });
      await tx.tripEvent.create({
        data: {
          tripId,
          type: 'ended',
          source: change.source,
          actorId: change.actor?.id ?? null,
          at: change.at,
          lat: change.position?.lat ?? null,
          lng: change.position?.lng ?? null,
          note: distanceKm != null ? `${distanceKm.toFixed(1)} km` : null,
        },
      });
      if (change.actor) {
        await this.audit.record(tx, change.actor, {
          entity: 'trip',
          entityId: tripId,
          action: 'end_manual',
        });
      }
    });

    const r = await this.requests.load(trip.orgId, trip.requestId);
    await this.notifications.notify(
      trip.orgId,
      [{ userId: r.requesterId }, ...(await this.requests.managers(trip.orgId))],
      messages.tripCompleted(factsOf(r), distanceKm),
      { requestId: r.id },
    );
    await this.live.setTripState(tripId, {});
    this.requests.broadcast(this.systemActor(trip.orgId), r);
    this.logger.log(
      `Trip ${tripId} completed (${change.source}), ${distanceKm?.toFixed(1) ?? '?'} km`,
    );
  }

  /** Distance along the recorded GPS points, when the tracker gives no odometer. */
  private async pathDistanceKm(vehicleId: string, from: Date, to: Date): Promise<number | null> {
    const points = await this.prisma.locationPoint.findMany({
      where: { vehicleId, recordedAt: { gte: from, lte: to } },
      orderBy: { recordedAt: 'asc' },
      select: { lat: true, lng: true },
    });
    if (points.length < 2) return null;
    let m = 0;
    for (let i = 1; i < points.length; i++) m += distanceM(points[i - 1]!, points[i]!);
    return Math.round(m / 100) / 10;
  }

  /** Broadcasts are role-independent; a system actor is enough to build the payload. */
  private systemActor(orgId: string): AuthUser {
    return { id: 'system', orgId, roles: [], departmentId: null };
  }
}
