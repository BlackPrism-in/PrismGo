import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { normalizeIndianMobile } from '@prismgo/shared';
import { AuditService } from '../audit/audit.service';
import { signupOrgId } from '../auth/signup-org';
import type { AuthUser } from '../auth/auth.types';
import type { Prisma } from '../generated/prisma/client';
import { messages } from '../notifications/messages';
import { NotificationsService } from '../notifications/notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import type { AccessRequestDto, CreateAccessRequestDto, SignupDepartmentDto } from './access.dto';

/** Stops a flood of fake sign-ups from burying real ones. */
const MAX_PENDING = 200;

const include = { department: { select: { id: true, name: true } } } satisfies Prisma.UserInclude;
type Row = Prisma.UserGetPayload<{ include: typeof include }>;

const toDto = (u: Row): AccessRequestDto => ({
  id: u.id,
  name: u.name,
  phone: u.phone,
  email: u.email,
  department: u.department,
  requestedAt: u.createdAt,
});

/**
 * Self-service sign-up. A new employee asks for access from the login screen and is
 * saved as a "pending" requester; their department's HOD (or an admin / transport
 * manager) approves, after which the normal OTP login works.
 */
@Injectable()
export class AccessService {
  private readonly logger = new Logger(AccessService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly audit: AuditService,
    private readonly notifications: NotificationsService,
  ) {}

  async departments(): Promise<SignupDepartmentDto[]> {
    const orgId = await this.signupOrgId();
    return this.prisma.department.findMany({
      where: { orgId },
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    });
  }

  /**
   * Always answers the same way, whether the number is new, already waiting or already
   * a user, so the form can't be used to find out who is registered.
   */
  async request(dto: CreateAccessRequestDto): Promise<{ received: true }> {
    const orgId = await this.signupOrgId();
    const phone = normalizeIndianMobile(dto.phone);
    if (!phone) throw new BadRequestException('Enter a valid 10-digit mobile number');
    const dept = await this.prisma.department.findFirst({
      where: { id: dto.departmentId, orgId },
      select: { id: true, name: true, hodUserId: true },
    });
    if (!dept) throw new BadRequestException('Choose your department');

    const existing = await this.prisma.user.findUnique({ where: { phone } });
    if (existing) return { received: true };

    const pending = await this.prisma.user.count({ where: { orgId, status: 'pending' } });
    if (pending >= MAX_PENDING) {
      throw new HttpException(
        'Too many requests are waiting. Please ask your HOD or the transport desk.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    let user: { id: string };
    try {
      user = await this.prisma.user.create({
        data: {
          orgId,
          name: dto.name.trim(),
          phone,
          email: dto.email?.trim() || null,
          roles: ['requester'],
          departmentId: dept.id,
          status: 'pending',
        },
        select: { id: true },
      });
    } catch {
      // Same number submitted twice at once: the first one wins.
      return { received: true };
    }
    this.logger.log(`Access request ${user.id} for ${dept.name}`);

    const recipients = dept.hodUserId
      ? [{ userId: dept.hodUserId }]
      : (
          await this.prisma.user.findMany({
            where: {
              orgId,
              status: 'active',
              roles: { hasSome: ['super_admin', 'transport_manager'] },
            },
            select: { id: true },
          })
        ).map((u) => ({ userId: u.id }));
    await this.notifications.notify(
      orgId,
      recipients,
      messages.accessRequested(dto.name.trim(), dept.name),
    );
    return { received: true };
  }

  async list(actor: AuthUser): Promise<AccessRequestDto[]> {
    const rows = await this.prisma.user.findMany({
      where: { orgId: actor.orgId, status: 'pending', ...this.scope(actor) },
      include,
      orderBy: { createdAt: 'asc' },
    });
    return rows.map(toDto);
  }

  async approve(actor: AuthUser, id: string): Promise<AccessRequestDto> {
    const before = await this.findPending(actor, id);
    return this.prisma.$transaction(async (tx) => {
      const row = await tx.user.update({ where: { id }, data: { status: 'active' }, include });
      await this.audit.record(tx, actor, {
        entity: 'user',
        entityId: id,
        action: 'approve_access',
        before,
        after: row,
      });
      return toDto(row);
    });
  }

  /** Declined requests are removed, so the person can apply again if it was a mistake. */
  async reject(actor: AuthUser, id: string): Promise<void> {
    const before = await this.findPending(actor, id);
    await this.prisma.$transaction(async (tx) => {
      await tx.user.delete({ where: { id } });
      await this.audit.record(tx, actor, {
        entity: 'user',
        entityId: id,
        action: 'reject_access',
        before,
      });
    });
  }

  /** Admins and transport managers see every request; an HOD sees their own department. */
  private scope(actor: AuthUser): Prisma.UserWhereInput {
    if (actor.roles.some((r) => r === 'super_admin' || r === 'transport_manager')) return {};
    return { department: { hodUserId: actor.id } };
  }

  private async findPending(actor: AuthUser, id: string): Promise<Row> {
    const row = await this.prisma.user.findFirst({
      where: { id, orgId: actor.orgId, status: 'pending' },
      include: { ...include, department: { select: { id: true, name: true, hodUserId: true } } },
    });
    if (!row) throw new NotFoundException('Request not found or already handled');
    const isAdmin = actor.roles.some((r) => r === 'super_admin' || r === 'transport_manager');
    if (!isAdmin && row.department?.hodUserId !== actor.id) {
      throw new ForbiddenException('Only the HOD of this department can decide');
    }
    return row;
  }

  private signupOrgId(): Promise<string> {
    return signupOrgId(this.prisma, this.config);
  }
}
