import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AuditService } from '../audit/audit.service';
import type { AuthUser } from '../auth/auth.types';
import type { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateDepartmentDto, DepartmentDto, UpdateDepartmentDto } from './departments.dto';

const include = {
  hod: { select: { id: true, name: true, phone: true } },
  _count: { select: { members: true } },
} satisfies Prisma.DepartmentInclude;

type Row = Prisma.DepartmentGetPayload<{ include: typeof include }>;

function toDto(d: Row): DepartmentDto {
  return {
    id: d.id,
    name: d.name,
    costCentre: d.costCentre,
    hod: d.hod,
    memberCount: d._count.members,
  };
}

@Injectable()
export class DepartmentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async list(actor: AuthUser): Promise<DepartmentDto[]> {
    const rows = await this.prisma.department.findMany({
      where: { orgId: actor.orgId },
      include,
      orderBy: { name: 'asc' },
    });
    return rows.map(toDto);
  }

  async create(actor: AuthUser, dto: CreateDepartmentDto): Promise<DepartmentDto> {
    if (dto.hodUserId) await this.assertHod(actor.orgId, dto.hodUserId);
    return this.prisma.$transaction(async (tx) => {
      const row = await tx.department.create({
        data: {
          orgId: actor.orgId,
          name: dto.name.trim(),
          costCentre: dto.costCentre ?? null,
          hodUserId: dto.hodUserId ?? null,
        },
        include,
      });
      await this.audit.record(tx, actor, {
        entity: 'department',
        entityId: row.id,
        action: 'create',
        after: row,
      });
      return toDto(row);
    });
  }

  async update(actor: AuthUser, id: string, dto: UpdateDepartmentDto): Promise<DepartmentDto> {
    const before = await this.findInOrg(actor.orgId, id);
    if (dto.hodUserId) await this.assertHod(actor.orgId, dto.hodUserId);
    return this.prisma.$transaction(async (tx) => {
      const row = await tx.department.update({
        where: { id },
        data: {
          name: dto.name?.trim(),
          costCentre: dto.costCentre,
          hodUserId: dto.hodUserId,
        },
        include,
      });
      await this.audit.record(tx, actor, {
        entity: 'department',
        entityId: id,
        action: 'update',
        before,
        after: row,
      });
      return toDto(row);
    });
  }

  private async findInOrg(orgId: string, id: string) {
    const row = await this.prisma.department.findFirst({ where: { id, orgId } });
    if (!row) throw new NotFoundException('Department not found');
    return row;
  }

  private async assertHod(orgId: string, userId: string): Promise<void> {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, orgId, status: 'active' },
    });
    if (!user) throw new BadRequestException('HOD must be an active user in this organisation');
    if (!user.roles.includes('hod'))
      throw new BadRequestException('That user does not have the HOD role');
  }
}
