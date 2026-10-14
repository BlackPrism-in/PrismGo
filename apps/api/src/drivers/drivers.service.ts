import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { normalizeIndianMobile } from '@prismgo/shared';
import { AuditService } from '../audit/audit.service';
import type { AuthUser } from '../auth/auth.types';
import type { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateDriverDto, DriverDto, UpdateDriverDto } from './drivers.dto';

const include = {
  defaultVehicle: { select: { id: true, regNo: true } },
} satisfies Prisma.DriverInclude;
type Row = Prisma.DriverGetPayload<{ include: typeof include }>;

function toDto(d: Row): DriverDto {
  return {
    id: d.id,
    name: d.name,
    phone: d.phone,
    licenceNo: d.licenceNo,
    licenceExpiry: d.licenceExpiry ? d.licenceExpiry.toISOString().slice(0, 10) : null,
    status: d.status,
    defaultVehicle: d.defaultVehicle,
  };
}

const toDate = (value: string | null | undefined) =>
  value === undefined
    ? undefined
    : value === null
      ? null
      : new Date(`${value.slice(0, 10)}T00:00:00Z`);

@Injectable()
export class DriversService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async list(actor: AuthUser): Promise<DriverDto[]> {
    const rows = await this.prisma.driver.findMany({
      where: { orgId: actor.orgId },
      include,
      orderBy: { name: 'asc' },
    });
    return rows.map(toDto);
  }

  async create(actor: AuthUser, dto: CreateDriverDto): Promise<DriverDto> {
    if (dto.defaultVehicleId) await this.assertVehicle(actor.orgId, dto.defaultVehicleId);
    return this.prisma.$transaction(async (tx) => {
      const row = await tx.driver.create({
        data: {
          orgId: actor.orgId,
          name: dto.name.trim(),
          phone: this.phone(dto.phone),
          licenceNo: dto.licenceNo.replace(/\s/g, '').toUpperCase(),
          licenceExpiry: toDate(dto.licenceExpiry) ?? null,
          defaultVehicleId: dto.defaultVehicleId ?? null,
        },
        include,
      });
      await this.audit.record(tx, actor, {
        entity: 'driver',
        entityId: row.id,
        action: 'create',
        after: row,
      });
      return toDto(row);
    });
  }

  async update(actor: AuthUser, id: string, dto: UpdateDriverDto): Promise<DriverDto> {
    const before = await this.prisma.driver.findFirst({ where: { id, orgId: actor.orgId } });
    if (!before) throw new NotFoundException('Driver not found');
    if (dto.defaultVehicleId) await this.assertVehicle(actor.orgId, dto.defaultVehicleId);
    return this.prisma.$transaction(async (tx) => {
      const row = await tx.driver.update({
        where: { id },
        data: {
          name: dto.name?.trim(),
          phone: dto.phone === undefined ? undefined : this.phone(dto.phone),
          licenceNo: dto.licenceNo?.replace(/\s/g, '').toUpperCase(),
          licenceExpiry: toDate(dto.licenceExpiry),
          defaultVehicleId: dto.defaultVehicleId,
          status: dto.status,
        },
        include,
      });
      await this.audit.record(tx, actor, {
        entity: 'driver',
        entityId: id,
        action: 'update',
        before,
        after: row,
      });
      return toDto(row);
    });
  }

  private phone(raw: string): string {
    const phone = normalizeIndianMobile(raw);
    if (!phone) throw new BadRequestException('Enter a valid 10-digit mobile number');
    return phone;
  }

  private async assertVehicle(orgId: string, vehicleId: string): Promise<void> {
    const v = await this.prisma.vehicle.findFirst({ where: { id: vehicleId, orgId } });
    if (!v) throw new BadRequestException('Vehicle not found');
  }
}
