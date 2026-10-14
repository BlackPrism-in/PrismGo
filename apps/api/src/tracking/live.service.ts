import { Injectable, NotFoundException } from '@nestjs/common';
import { estimateMinutes } from '@prismgo/shared';
import type { AuthUser } from '../auth/auth.types';
import { PrismaService } from '../prisma/prisma.service';
import { requestCode, RequestsService } from '../requests/requests.service';
import { LiveStateService, type LivePosition } from './live-state.service';
import type { LiveVehicleDto, PositionDto, TripTrackDto } from './tracking.dto';

const STALE_MS = 5 * 60 * 1000;
const UPCOMING_MS = 60 * 60 * 1000;
const MAX_TRACK_POINTS = 2000;

const toPosition = (p: LivePosition | null): PositionDto | null =>
  p
    ? { lat: p.lat, lng: p.lng, speedKmh: p.speedKmh, heading: p.heading, recordedAt: p.recordedAt }
    : null;

@Injectable()
export class LiveService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly live: LiveStateService,
    private readonly requests: RequestsService,
  ) {}

  /** Every active vehicle with its latest position and current or next trip. */
  async vehicles(actor: AuthUser): Promise<LiveVehicleDto[]> {
    const [vehicles, positions, trips] = await Promise.all([
      this.prisma.vehicle.findMany({
        where: { orgId: actor.orgId, status: { not: 'inactive' } },
        orderBy: { regNo: 'asc' },
      }),
      this.live.latestAll(actor.orgId),
      this.prisma.trip.findMany({
        where: {
          orgId: actor.orgId,
          OR: [
            { status: 'in_progress' },
            { status: 'scheduled', scheduledStart: { lte: new Date(Date.now() + UPCOMING_MS) } },
          ],
        },
        include: { request: { include: { requester: { select: { name: true } } } } },
        orderBy: { scheduledStart: 'asc' },
      }),
    ]);

    return vehicles.map((v) => {
      const p = positions.get(v.id) ?? null;
      const trip =
        trips.find((t) => t.vehicleId === v.id && t.status === 'in_progress') ??
        trips.find((t) => t.vehicleId === v.id) ??
        null;
      const etaTo = trip?.status === 'in_progress' ? 'drop' : 'pickup';
      const target = trip
        ? etaTo === 'drop'
          ? { lat: trip.request.dropLat, lng: trip.request.dropLng }
          : { lat: trip.request.pickupLat, lng: trip.request.pickupLng }
        : null;
      return {
        id: v.id,
        regNo: v.regNo,
        type: v.type,
        status: v.status,
        gpsDeviceId: v.gpsDeviceId,
        position: toPosition(p),
        stale: !p || Date.now() - Date.parse(p.recordedAt) > STALE_MS,
        trip: trip
          ? {
              id: trip.id,
              requestId: trip.requestId,
              code: requestCode(trip.request.number),
              status: trip.status as 'scheduled' | 'in_progress',
              requesterName: trip.request.requester.name,
              pickupAddress: trip.request.pickupAddress,
              dropAddress: trip.request.dropAddress,
              scheduledStart: trip.scheduledStart,
              etaMinutes: p && target ? estimateMinutes(p, target, p.speedKmh) : null,
              etaTo,
            }
          : null,
      };
    });
  }

  /** A trip's driven path and live position, for anyone who can see its request. */
  async track(actor: AuthUser, tripId: string): Promise<TripTrackDto> {
    const trip = await this.prisma.trip.findFirst({
      where: { id: tripId, orgId: actor.orgId },
      include: { vehicle: true },
    });
    if (!trip) throw new NotFoundException('Trip not found');
    const r = await this.requests.loadVisible(actor, trip.requestId);

    const from = trip.actualStart ?? trip.scheduledStart;
    const to = trip.actualEnd ?? new Date();
    const raw =
      trip.status === 'scheduled'
        ? []
        : await this.prisma.locationPoint.findMany({
            where: { vehicleId: trip.vehicleId, recordedAt: { gte: from, lte: to } },
            orderBy: { recordedAt: 'asc' },
            select: { lat: true, lng: true, recordedAt: true },
          });
    const step = Math.ceil(raw.length / MAX_TRACK_POINTS) || 1;
    const points = raw
      .filter((_, i) => i % step === 0 || i === raw.length - 1)
      .map((p) => ({ lat: p.lat, lng: p.lng, at: p.recordedAt }));

    // Before the trip, show the vehicle only within the hour before pickup: it may be
    // on someone else's trip until then.
    const live =
      trip.status === 'in_progress' ||
      (trip.status === 'scheduled' && trip.scheduledStart.getTime() - Date.now() <= UPCOMING_MS);
    const position = live ? await this.live.latest(actor.orgId, trip.vehicleId) : null;
    const etaTo = trip.status === 'scheduled' ? 'pickup' : 'drop';
    const target =
      etaTo === 'pickup'
        ? { lat: r.pickupLat, lng: r.pickupLng }
        : { lat: r.dropLat, lng: r.dropLng };

    return {
      tripId: trip.id,
      requestId: r.id,
      status: trip.status,
      vehicleRegNo: trip.vehicle.regNo,
      pickup: { lat: r.pickupLat, lng: r.pickupLng, at: r.startAt },
      drop: { lat: r.dropLat, lng: r.dropLng, at: r.returnAt ?? r.startAt },
      points,
      position: toPosition(position),
      etaMinutes: position ? estimateMinutes(position, target, position.speedKmh) : null,
      etaTo,
    };
  }
}
