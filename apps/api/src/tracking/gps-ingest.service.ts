import { Injectable } from '@nestjs/common';
import { estimateMinutes } from '@prismgo/shared';
import { PrismaService } from '../prisma/prisma.service';
import { RealtimeGateway, rooms } from '../realtime/realtime.gateway';
import { requestCode } from '../requests/requests.service';
import { LiveStateService, type LivePosition } from './live-state.service';
import type { GpsIngestResultDto, GpsPointDto } from './tracking.dto';
import { TripDetectorService } from './trip-detector.service';

const MAX_FUTURE_MS = 2 * 60 * 1000;
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;
const UPCOMING_MS = 60 * 60 * 1000;

/**
 * GPS pipeline: map device → vehicle, drop bad and duplicate points, store history,
 * update the latest position, push it live (throttled), then run the trip detector.
 */
@Injectable()
export class GpsIngestService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly live: LiveStateService,
    private readonly detector: TripDetectorService,
    private readonly realtime: RealtimeGateway,
  ) {}

  async ingest(points: GpsPointDto[]): Promise<GpsIngestResultDto> {
    const deviceIds = [...new Set(points.map((p) => p.deviceId))];
    const vehicles = await this.prisma.vehicle.findMany({
      where: { gpsDeviceId: { in: deviceIds } },
      select: { id: true, orgId: true, gpsDeviceId: true },
    });
    const byDevice = new Map(vehicles.map((v) => [v.gpsDeviceId!, v]));
    const unknownDevices = deviceIds.filter((d) => !byDevice.has(d));

    const now = Date.now();
    let rejected = 0;
    const perVehicle = new Map<string, { orgId: string; points: LivePosition[] }>();
    for (const p of points) {
      const vehicle = byDevice.get(p.deviceId);
      const t = Date.parse(p.recordedAt);
      if (!vehicle || t > now + MAX_FUTURE_MS || t < now - MAX_AGE_MS) {
        rejected++;
        continue;
      }
      const entry = perVehicle.get(vehicle.id) ?? { orgId: vehicle.orgId, points: [] };
      entry.points.push({
        vehicleId: vehicle.id,
        lat: p.lat,
        lng: p.lng,
        speedKmh: p.speedKmh ?? null,
        heading: p.heading ?? null,
        ignition: p.ignition ?? null,
        odometerKm: p.odometerKm ?? null,
        recordedAt: new Date(t).toISOString(),
      });
      perVehicle.set(vehicle.id, entry);
    }

    let accepted = 0;
    for (const [vehicleId, { orgId, points: list }] of perVehicle) {
      list.sort((a, b) => Date.parse(a.recordedAt) - Date.parse(b.recordedAt));
      const { count } = await this.prisma.locationPoint.createMany({
        data: list.map((p) => ({
          vehicleId,
          recordedAt: new Date(p.recordedAt),
          lat: p.lat,
          lng: p.lng,
          speedKmh: p.speedKmh,
          heading: p.heading,
          ignition: p.ignition,
          odometerKm: p.odometerKm,
        })),
        skipDuplicates: true,
      });
      accepted += count;

      const latest = list.at(-1)!;
      if (await this.live.setLatest(orgId, latest)) {
        if (this.live.shouldEmit(vehicleId)) await this.push(orgId, latest);
      }
      await this.detector.process(orgId, vehicleId, list);
    }

    return { accepted, duplicates: points.length - rejected - accepted, rejected, unknownDevices };
  }

  /** Live position to transport managers, and to the requester whose trip this vehicle is on. */
  private async push(orgId: string, p: LivePosition): Promise<void> {
    const trip = await this.prisma.trip.findFirst({
      where: {
        vehicleId: p.vehicleId,
        OR: [
          { status: 'in_progress' },
          { status: 'scheduled', scheduledStart: { lte: new Date(Date.now() + UPCOMING_MS) } },
        ],
      },
      orderBy: { scheduledStart: 'asc' },
      include: { request: true },
    });
    const etaTo = trip?.status === 'in_progress' ? 'drop' : 'pickup';
    const target = trip
      ? etaTo === 'drop'
        ? { lat: trip.request.dropLat, lng: trip.request.dropLng }
        : { lat: trip.request.pickupLat, lng: trip.request.pickupLng }
      : null;

    const payload = {
      vehicleId: p.vehicleId,
      lat: p.lat,
      lng: p.lng,
      speedKmh: p.speedKmh,
      heading: p.heading,
      recordedAt: p.recordedAt,
      tripId: trip?.id ?? null,
      requestId: trip?.requestId ?? null,
      code: trip ? requestCode(trip.request.number) : null,
      etaMinutes: target ? estimateMinutes(p, target, p.speedKmh) : null,
      etaTo,
    };
    const targets = [rooms.managers(orgId)];
    if (trip) targets.push(rooms.user(trip.request.requesterId));
    this.realtime.emit(targets, 'vehicle.position', payload);
  }
}
