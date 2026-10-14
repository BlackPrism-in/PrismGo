import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { nextRequestStatus, type RequestAction, type RequestStatus } from '@prismgo/shared';
import { AuditService } from '../audit/audit.service';
import type { AuthUser } from '../auth/auth.types';
import type { Prisma } from '../generated/prisma/client';
import { messages, type RequestFacts } from '../notifications/messages';
import { NotificationsService, type Recipient } from '../notifications/notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import { RealtimeGateway, rooms } from '../realtime/realtime.gateway';
import type {
  CreateRequestDto,
  ListRequestsQuery,
  RequestDto,
  TimelineEntryDto,
  UpdateRequestDto,
} from './requests.dto';

export const requestInclude = {
  requester: { select: { id: true, name: true, phone: true } },
  department: { select: { id: true, name: true, hodUserId: true } },
  cancelledBy: { select: { name: true } },
  approvals: { include: { approver: { select: { name: true } } }, orderBy: { decidedAt: 'asc' } },
  trips: {
    include: {
      vehicle: { select: { id: true, regNo: true, type: true, seats: true } },
      driver: { select: { id: true, name: true, phone: true } },
      events: { include: { actor: { select: { name: true } } }, orderBy: { at: 'asc' } },
    },
    orderBy: { createdAt: 'asc' },
  },
} satisfies Prisma.TripRequestInclude;

export type RequestRow = Prisma.TripRequestGetPayload<{ include: typeof requestInclude }>;

const AUTO_APPROVE_NOTE = 'Auto-approved: requester is the department HOD';

export const isManager = (u: AuthUser) =>
  u.roles.includes('transport_manager') || u.roles.includes('super_admin');

export const requestCode = (number: number) => `PG-${number}`;

export function currentTrip(r: RequestRow) {
  return [...r.trips].reverse().find((t) => t.status !== 'cancelled') ?? null;
}

export function factsOf(r: RequestRow): RequestFacts {
  return {
    code: requestCode(r.number),
    requesterName: r.requester.name,
    departmentName: r.department.name,
    pickup: r.pickupAddress,
    drop: r.dropAddress,
    startAt: r.startAt,
  };
}

@Injectable()
export class RequestsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly notifications: NotificationsService,
    private readonly realtime: RealtimeGateway,
  ) {}

  // ─── Queries ──────────────────────────────────────────────────────────────

  async list(actor: AuthUser, query: ListRequestsQuery): Promise<RequestDto[]> {
    const scope = query.scope ?? 'mine';
    const where: Prisma.TripRequestWhereInput = { orgId: actor.orgId, status: query.status };

    if (scope === 'mine') {
      where.requesterId = actor.id;
    } else if (scope === 'approvals') {
      where.department = { hodUserId: actor.id };
      where.status = query.status ?? { not: 'draft' };
    } else {
      if (!isManager(actor))
        throw new ForbiddenException('Only transport managers can see all requests');
      where.status = query.status ?? { not: 'draft' };
    }

    const rows = await this.prisma.tripRequest.findMany({
      where,
      include: requestInclude,
      orderBy: [{ startAt: scope === 'mine' ? 'desc' : 'asc' }],
      take: 200,
    });
    return rows.map((r) => this.toDto(r, actor));
  }

  async get(actor: AuthUser, id: string): Promise<RequestDto> {
    return this.toDto(await this.loadVisible(actor, id), actor);
  }

  // ─── Requester actions ────────────────────────────────────────────────────

  async create(actor: AuthUser, dto: CreateRequestDto): Promise<RequestDto> {
    if (!actor.roles.includes('requester') && !actor.roles.includes('hod')) {
      throw new ForbiddenException('Your role cannot raise vehicle requests');
    }
    if (!actor.departmentId) {
      throw new BadRequestException('You are not in a department yet. Ask your admin to add you.');
    }
    const { startAt, returnAt } = this.validateTimes(dto.startAt, dto.returnAt ?? null);

    const created = await this.prisma.$transaction(async (tx) => {
      const row = await tx.tripRequest.create({
        data: {
          orgId: actor.orgId,
          requesterId: actor.id,
          departmentId: actor.departmentId!,
          pickupAddress: dto.pickup.address.trim(),
          pickupLat: dto.pickup.lat,
          pickupLng: dto.pickup.lng,
          dropAddress: dto.drop.address.trim(),
          dropLat: dto.drop.lat,
          dropLng: dto.drop.lng,
          startAt,
          returnAt,
          passengers: dto.passengers,
          purpose: dto.purpose.trim(),
          notes: dto.notes?.trim() || null,
        },
      });
      await this.audit.record(tx, actor, {
        entity: 'trip_request',
        entityId: row.id,
        action: 'create',
        after: row,
      });
      return row;
    });

    if (dto.submit === false) return this.get(actor, created.id);
    return this.submit(actor, created.id);
  }

  async update(actor: AuthUser, id: string, dto: UpdateRequestDto): Promise<RequestDto> {
    const before = await this.loadVisible(actor, id);
    if (before.requesterId !== actor.id)
      throw new ForbiddenException('Only the requester can edit');
    if (before.status !== 'draft' && before.status !== 'pending_approval') {
      throw new ConflictException('Only draft or pending requests can be edited');
    }
    const { startAt, returnAt } = this.validateTimes(
      dto.startAt ?? before.startAt.toISOString(),
      dto.returnAt === undefined ? (before.returnAt?.toISOString() ?? null) : dto.returnAt,
    );

    await this.prisma.$transaction(async (tx) => {
      const after = await tx.tripRequest.update({
        where: { id },
        data: {
          pickupAddress: dto.pickup?.address.trim(),
          pickupLat: dto.pickup?.lat,
          pickupLng: dto.pickup?.lng,
          dropAddress: dto.drop?.address.trim(),
          dropLat: dto.drop?.lat,
          dropLng: dto.drop?.lng,
          startAt,
          returnAt,
          passengers: dto.passengers,
          purpose: dto.purpose?.trim(),
          notes: dto.notes === undefined ? undefined : dto.notes?.trim() || null,
        },
      });
      await this.audit.record(tx, actor, {
        entity: 'trip_request',
        entityId: id,
        action: 'update',
        before,
        after,
      });
    });
    return this.refreshAndBroadcast(actor, id);
  }

  /**
   * draft → pending_approval. If the requester heads the department, it is
   * approved straight away (an HOD does not approve their own request twice).
   */
  async submit(actor: AuthUser, id: string): Promise<RequestDto> {
    const r = await this.loadVisible(actor, id);
    if (r.requesterId !== actor.id) throw new ForbiddenException('Only the requester can submit');
    this.transition(r.status, 'submit');
    const selfApproved = r.department.hodUserId === actor.id;

    await this.prisma.$transaction(async (tx) => {
      await this.guardedUpdate(tx, r, {
        status: selfApproved ? 'approved' : 'pending_approval',
        submittedAt: new Date(),
      });
      if (selfApproved) {
        await tx.approval.create({
          data: {
            requestId: id,
            approverId: actor.id,
            decision: 'approved',
            comment: AUTO_APPROVE_NOTE,
          },
        });
      }
      await this.audit.record(tx, actor, {
        entity: 'trip_request',
        entityId: id,
        action: selfApproved ? 'submit_auto_approved' : 'submit',
      });
    });

    const fresh = await this.load(actor.orgId, id);
    const facts = factsOf(fresh);
    if (selfApproved) {
      await this.notifications.notify(
        actor.orgId,
        await this.managers(actor.orgId),
        messages.readyToAssign(facts),
        { requestId: id },
      );
    } else if (fresh.department.hodUserId) {
      await this.notifications.notify(
        actor.orgId,
        [{ userId: fresh.department.hodUserId }],
        messages.submitted(facts),
        { requestId: id },
      );
    } else {
      await this.notifications.notify(
        actor.orgId,
        await this.admins(actor.orgId),
        messages.noHod(facts),
        { requestId: id },
      );
    }
    return this.broadcast(actor, fresh);
  }

  async cancel(actor: AuthUser, id: string, reason?: string): Promise<RequestDto> {
    const r = await this.loadVisible(actor, id);
    if (!this.allowedActions(r, actor).includes('cancel')) {
      throw new ForbiddenException('You cannot cancel this request');
    }
    this.transition(r.status, 'cancel');
    const trip = currentTrip(r);

    await this.prisma.$transaction(async (tx) => {
      await this.guardedUpdate(tx, r, {
        status: 'cancelled',
        cancelledAt: new Date(),
        cancelledById: actor.id,
        cancelReason: reason?.trim() || null,
      });
      if (trip) {
        await tx.trip.update({ where: { id: trip.id }, data: { status: 'cancelled' } });
      }
      await this.audit.record(tx, actor, {
        entity: 'trip_request',
        entityId: id,
        action: 'cancel',
        after: { reason },
      });
    });

    const fresh = await this.load(actor.orgId, id);
    const actorName =
      (await this.prisma.user.findUnique({ where: { id: actor.id } }))?.name ?? 'Someone';
    const recipients: Recipient[] = [{ userId: r.requesterId }];
    if (r.status === 'pending_approval' && r.department.hodUserId) {
      recipients.push({ userId: r.department.hodUserId });
    }
    if (r.status === 'approved' || r.status === 'assigned') {
      recipients.push(...(await this.managers(actor.orgId)));
    }
    if (trip) recipients.push({ phone: trip.driver.phone });
    await this.notifications.notify(
      actor.orgId,
      recipients.filter((x) => x.userId !== actor.id),
      messages.cancelled(factsOf(fresh), actorName, reason?.trim() || null),
      { requestId: id },
    );
    return this.broadcast(actor, fresh);
  }

  // ─── HOD actions ──────────────────────────────────────────────────────────

  async approve(actor: AuthUser, id: string, comment?: string): Promise<RequestDto> {
    const r = await this.loadForApprover(actor, id);
    this.transition(r.status, 'approve');
    await this.prisma.$transaction(async (tx) => {
      await this.guardedUpdate(tx, r, { status: 'approved' });
      await tx.approval.create({
        data: {
          requestId: id,
          approverId: actor.id,
          decision: 'approved',
          comment: comment?.trim() || null,
        },
      });
      await this.audit.record(tx, actor, {
        entity: 'trip_request',
        entityId: id,
        action: 'approve',
        after: { comment },
      });
    });

    const fresh = await this.load(actor.orgId, id);
    const facts = factsOf(fresh);
    const approverName = fresh.approvals.at(-1)?.approver.name ?? 'Your HOD';
    await this.notifications.notify(
      actor.orgId,
      [{ userId: r.requesterId }],
      messages.approved(facts, approverName),
      { requestId: id },
    );
    await this.notifications.notify(
      actor.orgId,
      await this.managers(actor.orgId),
      messages.readyToAssign(facts),
      { requestId: id },
    );
    return this.broadcast(actor, fresh);
  }

  async reject(actor: AuthUser, id: string, comment: string): Promise<RequestDto> {
    const r = await this.loadForApprover(actor, id);
    this.transition(r.status, 'reject');
    await this.prisma.$transaction(async (tx) => {
      await this.guardedUpdate(tx, r, { status: 'rejected' });
      await tx.approval.create({
        data: {
          requestId: id,
          approverId: actor.id,
          decision: 'rejected',
          comment: comment.trim(),
        },
      });
      await this.audit.record(tx, actor, {
        entity: 'trip_request',
        entityId: id,
        action: 'reject',
        after: { comment },
      });
    });

    const fresh = await this.load(actor.orgId, id);
    const approverName = fresh.approvals.at(-1)?.approver.name ?? 'Your HOD';
    await this.notifications.notify(
      actor.orgId,
      [{ userId: r.requesterId }],
      messages.rejected(factsOf(fresh), approverName, comment.trim()),
      { requestId: id },
    );
    return this.broadcast(actor, fresh);
  }

  // ─── Shared helpers (also used by assignments) ────────────────────────────

  async load(orgId: string, id: string): Promise<RequestRow> {
    const r = await this.prisma.tripRequest.findFirst({
      where: { id, orgId },
      include: requestInclude,
    });
    if (!r) throw new NotFoundException('Request not found');
    return r;
  }

  /** Loads a request the actor may see: requester, HOD of its department, or a manager. */
  async loadVisible(actor: AuthUser, id: string): Promise<RequestRow> {
    const r = await this.load(actor.orgId, id);
    const visible =
      r.requesterId === actor.id || r.department.hodUserId === actor.id || isManager(actor);
    if (!visible || (r.status === 'draft' && r.requesterId !== actor.id)) {
      throw new NotFoundException('Request not found');
    }
    return r;
  }

  /**
   * Updates the request only if its status is still what we read, so two people
   * acting at once (e.g. approve and cancel) can't both succeed.
   */
  async guardedUpdate(
    tx: Prisma.TransactionClient,
    r: { id: string; status: RequestStatus },
    data: Prisma.TripRequestUncheckedUpdateManyInput,
  ): Promise<void> {
    const { count } = await tx.tripRequest.updateMany({
      where: { id: r.id, status: r.status },
      data,
    });
    if (count === 0)
      throw new ConflictException(
        'This request was just changed by someone else. Refresh and try again.',
      );
  }

  transition(current: RequestStatus, action: RequestAction): RequestStatus {
    const next = nextRequestStatus(current, action);
    if (!next) {
      throw new ConflictException(`Can't ${action} a request that is ${current.replace('_', ' ')}`);
    }
    return next;
  }

  async managers(orgId: string): Promise<Recipient[]> {
    const users = await this.prisma.user.findMany({
      where: { orgId, status: 'active', roles: { has: 'transport_manager' } },
      select: { id: true },
    });
    return users.map((u) => ({ userId: u.id }));
  }

  private async admins(orgId: string): Promise<Recipient[]> {
    const users = await this.prisma.user.findMany({
      where: { orgId, status: 'active', roles: { hasSome: ['super_admin', 'transport_manager'] } },
      select: { id: true },
    });
    return users.map((u) => ({ userId: u.id }));
  }

  /** Re-reads the request and pushes `request.updated` to everyone who can see it. */
  async refreshAndBroadcast(actor: AuthUser, id: string): Promise<RequestDto> {
    return this.broadcast(actor, await this.load(actor.orgId, id));
  }

  broadcast(actor: AuthUser, r: RequestRow): RequestDto {
    const targets = [rooms.user(r.requesterId), rooms.managers(r.orgId)];
    if (r.department.hodUserId) targets.push(rooms.user(r.department.hodUserId));
    this.realtime.emit(targets, 'request.updated', { id: r.id, status: r.status });
    return this.toDto(r, actor);
  }

  allowedActions(r: RequestRow, actor: AuthUser): string[] {
    const mine = r.requesterId === actor.id;
    const hod = r.department.hodUserId === actor.id;
    const manager = isManager(actor);
    const trip = currentTrip(r);
    const actions: string[] = [];
    if (mine && (r.status === 'draft' || r.status === 'pending_approval')) actions.push('edit');
    if (mine && r.status === 'draft') actions.push('submit');
    if (hod && !mine && r.status === 'pending_approval') actions.push('approve', 'reject');
    if (manager && r.status === 'approved') actions.push('assign');
    if (manager && r.status === 'assigned' && trip?.status === 'scheduled')
      actions.push('reassign', 'start');
    if (manager && r.status === 'in_progress' && trip?.status === 'in_progress')
      actions.push('end');
    const cancellable = ['draft', 'pending_approval', 'approved', 'assigned'].includes(r.status);
    const tripNotStarted = !trip || trip.status === 'scheduled';
    if (cancellable && tripNotStarted && (mine || hod || manager)) actions.push('cancel');
    return actions;
  }

  toDto(r: RequestRow, actor: AuthUser): RequestDto {
    const trip = currentTrip(r);
    return {
      id: r.id,
      code: requestCode(r.number),
      status: r.status,
      requester: r.requester,
      department: { id: r.department.id, name: r.department.name },
      pickup: { address: r.pickupAddress, lat: r.pickupLat, lng: r.pickupLng },
      drop: { address: r.dropAddress, lat: r.dropLat, lng: r.dropLng },
      startAt: r.startAt,
      returnAt: r.returnAt,
      passengers: r.passengers,
      purpose: r.purpose,
      notes: r.notes,
      cancelReason: r.cancelReason,
      trip: trip
        ? {
            id: trip.id,
            status: trip.status,
            vehicle: trip.vehicle,
            driver: trip.driver,
            scheduledStart: trip.scheduledStart,
            scheduledEnd: trip.scheduledEnd,
          }
        : null,
      timeline: this.timeline(r),
      actions: this.allowedActions(r, actor),
      createdAt: r.createdAt,
    };
  }

  private timeline(r: RequestRow): TimelineEntryDto[] {
    const entries: TimelineEntryDto[] = [
      { type: 'created', at: r.createdAt, actorName: r.requester.name, note: null },
    ];
    if (r.submittedAt) {
      entries.push({
        type: 'submitted',
        at: r.submittedAt,
        actorName: r.requester.name,
        note: null,
      });
    }
    for (const a of r.approvals) {
      const auto = a.comment === AUTO_APPROVE_NOTE;
      entries.push({
        type: auto ? 'auto_approved' : a.decision,
        at: a.decidedAt,
        actorName: a.approver.name,
        note: auto ? null : a.comment,
      });
    }
    for (const t of r.trips) {
      for (const e of t.events) {
        entries.push({
          type: e.type,
          at: e.at,
          actorName: e.actor?.name ?? null,
          note:
            e.note ??
            (e.type === 'assigned' || e.type === 'reassigned'
              ? `${t.vehicle.regNo} · ${t.driver.name}`
              : null),
        });
      }
    }
    if (r.cancelledAt) {
      entries.push({
        type: 'cancelled',
        at: r.cancelledAt,
        actorName: r.cancelledBy?.name ?? null,
        note: r.cancelReason,
      });
    }
    return entries.sort((a, b) => a.at.getTime() - b.at.getTime());
  }

  private async loadForApprover(actor: AuthUser, id: string): Promise<RequestRow> {
    const r = await this.loadVisible(actor, id);
    if (r.department.hodUserId !== actor.id) {
      throw new ForbiddenException('Only the HOD of this department can decide on it');
    }
    if (r.requesterId === actor.id) {
      throw new ForbiddenException('You cannot approve your own request');
    }
    return r;
  }

  private validateTimes(startIso: string, returnIso: string | null) {
    const startAt = new Date(startIso);
    const returnAt = returnIso ? new Date(returnIso) : null;
    if (startAt.getTime() < Date.now() - 5 * 60_000) {
      throw new BadRequestException('Pickup time must be in the future');
    }
    if (returnAt && returnAt <= startAt) {
      throw new BadRequestException('Return time must be after pickup time');
    }
    return { startAt, returnAt };
  }
}
