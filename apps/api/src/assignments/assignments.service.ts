import { BadRequestException, ConflictException, Injectable, Logger } from '@nestjs/common';
import { AuditService } from '../audit/audit.service';
import type { AuthUser } from '../auth/auth.types';
import { messages } from '../notifications/messages';
import { NotificationsService } from '../notifications/notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import { currentTrip, factsOf, requestCode, RequestsService } from '../requests/requests.service';
import type { RequestDto } from '../requests/requests.dto';
import type { AssignDto, AvailabilityDto, ConflictDto, ReassignDto } from './assignments.dto';

const DEFAULT_TRIP_MS = 2 * 60 * 60 * 1000;
const ACTIVE_TRIP = ['scheduled', 'in_progress'] as const;

/** True when Postgres rejected the insert through a double-booking exclusion constraint. */
function isOverlapViolation(err: unknown): boolean {
  const text = `${(err as Error)?.message ?? ''} ${JSON.stringify((err as { meta?: unknown })?.meta ?? '')}`;
  return text.includes('23P01') || text.includes('_no_overlap');
}

@Injectable()
export class AssignmentsService {
  private readonly logger = new Logger(AssignmentsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly requests: RequestsService,
    private readonly notifications: NotificationsService,
  ) {}

  /** Every active vehicle and driver, marked free or busy for [from, to). */
  async availability(
    actor: AuthUser,
    fromIso: string,
    toIso: string,
    passengers = 1,
    ignoreTripId?: string,
  ): Promise<AvailabilityDto> {
    const from = new Date(fromIso);
    const to = new Date(toIso);
    if (to <= from) throw new BadRequestException('"to" must be after "from"');

    const [vehicles, drivers, busy] = await Promise.all([
      this.prisma.vehicle.findMany({
        where: { orgId: actor.orgId, status: { in: ['available', 'on_trip'] } },
        orderBy: { regNo: 'asc' },
      }),
      this.prisma.driver.findMany({
        where: { orgId: actor.orgId, status: 'active' },
        orderBy: { name: 'asc' },
      }),
      this.prisma.trip.findMany({
        where: {
          orgId: actor.orgId,
          status: { in: [...ACTIVE_TRIP] },
          scheduledStart: { lt: to },
          scheduledEnd: { gt: from },
          id: ignoreTripId ? { not: ignoreTripId } : undefined,
        },
        include: { request: { select: { id: true, number: true } } },
      }),
    ]);

    const conflictFor = (match: (t: (typeof busy)[number]) => boolean): ConflictDto | null => {
      const t = busy.find(match);
      return t
        ? {
            requestCode: requestCode(t.request.number),
            requestId: t.request.id,
            from: t.scheduledStart,
            to: t.scheduledEnd,
          }
        : null;
    };

    return {
      vehicles: vehicles.map((v) => {
        const conflict = conflictFor((t) => t.vehicleId === v.id);
        return {
          id: v.id,
          regNo: v.regNo,
          type: v.type,
          seats: v.seats,
          available: !conflict,
          fits: v.seats >= passengers,
          conflict,
        };
      }),
      drivers: drivers.map((d) => {
        const conflict = conflictFor((t) => t.driverId === d.id);
        return {
          id: d.id,
          name: d.name,
          phone: d.phone,
          defaultVehicleId: d.defaultVehicleId,
          available: !conflict,
          conflict,
        };
      }),
    };
  }

  async assign(actor: AuthUser, requestId: string, dto: AssignDto): Promise<RequestDto> {
    const r = await this.requests.loadVisible(actor, requestId);
    this.requests.transition(r.status, 'assign');
    const scheduledStart = r.startAt;
    const scheduledEnd = dto.scheduledEnd
      ? new Date(dto.scheduledEnd)
      : (r.returnAt ?? new Date(r.startAt.getTime() + DEFAULT_TRIP_MS));
    if (scheduledEnd <= scheduledStart) {
      throw new BadRequestException('The vehicle must be booked until after the pickup time');
    }
    await this.assertUsable(actor.orgId, dto.vehicleId, dto.driverId, r.passengers);

    await this.withOverlapCheck(() =>
      this.prisma.$transaction(async (tx) => {
        await this.requests.guardedUpdate(tx, r, { status: 'assigned' });
        const trip = await tx.trip.create({
          data: {
            orgId: actor.orgId,
            requestId,
            vehicleId: dto.vehicleId,
            driverId: dto.driverId,
            assignedById: actor.id,
            scheduledStart,
            scheduledEnd,
          },
        });
        await tx.tripEvent.create({
          data: { tripId: trip.id, type: 'assigned', source: 'manager', actorId: actor.id },
        });
        await this.audit.record(tx, actor, {
          entity: 'trip',
          entityId: trip.id,
          action: 'assign',
          after: trip,
        });
      }),
    );

    const fresh = await this.requests.load(actor.orgId, requestId);
    await this.notifyAssigned(actor, fresh);
    return this.requests.broadcast(actor, fresh);
  }

  /** Swaps vehicle and/or driver before the trip starts: cancels the trip and books a new one. */
  async reassign(actor: AuthUser, tripId: string, dto: ReassignDto): Promise<RequestDto> {
    if (!dto.vehicleId && !dto.driverId) {
      throw new BadRequestException('Choose a new vehicle or driver');
    }
    const old = await this.prisma.trip.findFirst({ where: { id: tripId, orgId: actor.orgId } });
    if (!old) throw new BadRequestException('Trip not found');
    if (old.status !== 'scheduled') {
      throw new ConflictException('Only trips that have not started can be reassigned');
    }
    const r = await this.requests.loadVisible(actor, old.requestId);
    const vehicleId = dto.vehicleId ?? old.vehicleId;
    const driverId = dto.driverId ?? old.driverId;
    if (vehicleId === old.vehicleId && driverId === old.driverId) {
      throw new BadRequestException('That is the current assignment');
    }
    await this.assertUsable(actor.orgId, vehicleId, driverId, r.passengers);

    await this.withOverlapCheck(() =>
      this.prisma.$transaction(async (tx) => {
        const { count } = await tx.trip.updateMany({
          where: { id: tripId, status: 'scheduled' },
          data: { status: 'cancelled' },
        });
        if (count === 0)
          throw new ConflictException('This trip was just changed. Refresh and try again.');
        const trip = await tx.trip.create({
          data: {
            orgId: actor.orgId,
            requestId: old.requestId,
            vehicleId,
            driverId,
            assignedById: actor.id,
            scheduledStart: old.scheduledStart,
            scheduledEnd: old.scheduledEnd,
          },
        });
        await tx.tripEvent.create({
          data: { tripId: trip.id, type: 'reassigned', source: 'manager', actorId: actor.id },
        });
        await this.audit.record(tx, actor, {
          entity: 'trip',
          entityId: trip.id,
          action: 'reassign',
          before: old,
          after: trip,
        });
      }),
    );

    const fresh = await this.requests.load(actor.orgId, old.requestId);
    await this.notifyAssigned(actor, fresh);
    if (driverId !== old.driverId) {
      const oldDriver = await this.prisma.driver.findUnique({ where: { id: old.driverId } });
      const actorName =
        (await this.prisma.user.findUnique({ where: { id: actor.id } }))?.name ?? 'Transport';
      if (oldDriver) {
        await this.notifications.notify(
          actor.orgId,
          [{ phone: oldDriver.phone }],
          messages.cancelled(factsOf(fresh), actorName, 'Trip reassigned to another driver'),
          { requestId: fresh.id },
        );
      }
    }
    return this.requests.broadcast(actor, fresh);
  }

  private async notifyAssigned(actor: AuthUser, r: Awaited<ReturnType<RequestsService['load']>>) {
    const trip = currentTrip(r);
    if (!trip) return;
    const vehicle = `${trip.vehicle.regNo} (${trip.vehicle.type})`;
    const facts = factsOf(r);
    await this.notifications.notify(
      actor.orgId,
      [{ userId: r.requesterId }],
      messages.assigned(facts, vehicle, trip.driver.name, trip.driver.phone),
      { requestId: r.id },
    );
    await this.notifications.notify(
      actor.orgId,
      [{ phone: trip.driver.phone }],
      messages.driverAssigned(facts, vehicle, r.requester.phone),
      { requestId: r.id },
    );
  }

  private async assertUsable(
    orgId: string,
    vehicleId: string,
    driverId: string,
    passengers: number,
  ) {
    const [vehicle, driver] = await Promise.all([
      this.prisma.vehicle.findFirst({ where: { id: vehicleId, orgId } }),
      this.prisma.driver.findFirst({ where: { id: driverId, orgId } }),
    ]);
    if (!vehicle || vehicle.status === 'maintenance' || vehicle.status === 'inactive') {
      throw new BadRequestException('That vehicle is not available for trips');
    }
    if (!driver || driver.status !== 'active') {
      throw new BadRequestException('That driver is not available for trips');
    }
    if (vehicle.seats < passengers) {
      throw new BadRequestException(
        `${vehicle.regNo} has ${vehicle.seats} seats; this trip needs ${passengers}`,
      );
    }
  }

  /** Maps the database's double-booking constraint to a clear 409. */
  private async withOverlapCheck<T>(fn: () => Promise<T>): Promise<T> {
    try {
      return await fn();
    } catch (err) {
      if (isOverlapViolation(err)) {
        throw new ConflictException(
          'That vehicle or driver is already booked for an overlapping trip',
        );
      }
      this.logger.debug(`assignment failed: ${(err as Error).message}`);
      throw err;
    }
  }
}
