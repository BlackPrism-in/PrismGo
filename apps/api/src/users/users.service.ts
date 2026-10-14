import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { normalizeIndianMobile } from '@prismgo/shared';
import { AuditService } from '../audit/audit.service';
import type { AuthUser } from '../auth/auth.types';
import { TokensService } from '../auth/tokens.service';
import type { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateUserDto, ListUsersQuery, UpdateUserDto, UserDto } from './users.dto';

const include = { department: { select: { id: true, name: true } } } satisfies Prisma.UserInclude;
type Row = Prisma.UserGetPayload<{ include: typeof include }>;

function toDto(u: Row): UserDto {
  return {
    id: u.id,
    name: u.name,
    phone: u.phone,
    email: u.email,
    roles: u.roles,
    status: u.status,
    department: u.department,
    lastLoginAt: u.lastLoginAt,
  };
}

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly tokens: TokensService,
  ) {}

  async list(actor: AuthUser, query: ListUsersQuery): Promise<UserDto[]> {
    const q = query.q?.trim();
    const rows = await this.prisma.user.findMany({
      where: {
        orgId: actor.orgId,
        roles: query.role ? { has: query.role } : undefined,
        departmentId: query.departmentId,
        status: query.status,
        OR: q
          ? [
              { name: { contains: q, mode: 'insensitive' } },
              { phone: { contains: q.replace(/\s/g, '') } },
            ]
          : undefined,
      },
      include,
      orderBy: { name: 'asc' },
    });
    return rows.map(toDto);
  }

  async get(actor: AuthUser, id: string): Promise<UserDto> {
    return toDto(await this.findInOrg(actor.orgId, id));
  }

  async create(actor: AuthUser, dto: CreateUserDto): Promise<UserDto> {
    const phone = this.phone(dto.phone);
    if (dto.departmentId) await this.assertDepartment(actor.orgId, dto.departmentId);
    return this.prisma.$transaction(async (tx) => {
      const row = await tx.user.create({
        data: {
          orgId: actor.orgId,
          name: dto.name.trim(),
          phone,
          email: dto.email ?? null,
          roles: dto.roles,
          departmentId: dto.departmentId ?? null,
        },
        include,
      });
      await this.audit.record(tx, actor, {
        entity: 'user',
        entityId: row.id,
        action: 'create',
        after: row,
      });
      return toDto(row);
    });
  }

  async update(actor: AuthUser, id: string, dto: UpdateUserDto): Promise<UserDto> {
    const before = await this.findInOrg(actor.orgId, id);
    if (id === actor.id && dto.status === 'inactive') {
      throw new BadRequestException('You cannot deactivate your own account');
    }
    if (dto.departmentId) await this.assertDepartment(actor.orgId, dto.departmentId);

    const row = await this.prisma.$transaction(async (tx) => {
      const updated = await tx.user.update({
        where: { id },
        data: {
          name: dto.name?.trim(),
          phone: dto.phone === undefined ? undefined : this.phone(dto.phone),
          email: dto.email,
          roles: dto.roles,
          departmentId: dto.departmentId,
          status: dto.status,
        },
        include,
      });
      // A user who loses the HOD role (or is deactivated) stops heading their department.
      if (!updated.roles.includes('hod') || updated.status === 'inactive') {
        await tx.department.updateMany({ where: { hodUserId: id }, data: { hodUserId: null } });
      }
      await this.audit.record(tx, actor, {
        entity: 'user',
        entityId: id,
        action: 'update',
        before,
        after: updated,
      });
      return updated;
    });

    // Role or status changes take effect at next refresh; deactivation ends sessions now.
    if (row.status === 'inactive') await this.tokens.revokeAll(id);
    return toDto(row);
  }

  private phone(raw: string): string {
    const phone = normalizeIndianMobile(raw);
    if (!phone) throw new BadRequestException('Enter a valid 10-digit mobile number');
    return phone;
  }

  private async findInOrg(orgId: string, id: string): Promise<Row> {
    const row = await this.prisma.user.findFirst({ where: { id, orgId }, include });
    if (!row) throw new NotFoundException('User not found');
    return row;
  }

  private async assertDepartment(orgId: string, departmentId: string): Promise<void> {
    const dept = await this.prisma.department.findFirst({ where: { id: departmentId, orgId } });
    if (!dept) throw new BadRequestException('Department not found');
  }
}
