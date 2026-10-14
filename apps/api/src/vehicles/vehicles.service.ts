import { Injectable, NotFoundException } from '@nestjs/common';
import { AuditService } from '../audit/audit.service';
import type { AuthUser } from '../auth/auth.types';
import type { Vehicle } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateVehicleDto, UpdateVehicleDto, VehicleDto } from './vehicles.dto';

const normalizeRegNo = (regNo: string) => regNo.replace(/[\s-]/g, '').toUpperCase();

function toDto(v: Vehicle): VehicleDto {
  return {
    id: v.id,
    regNo: v.regNo,
    type: v.type,
    make: v.make,
    model: v.model,
    seats: v.seats,
    status: v.status,
    gpsDeviceId: v.gpsDeviceId,
  };
}

@Injectable()
export class VehiclesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async list(actor: AuthUser): Promise<VehicleDto[]> {
    const rows = await this.prisma.vehicle.findMany({
      where: { orgId: actor.orgId },
      orderBy: { regNo: 'asc' },
    });
    return rows.map(toDto);
  }

  async create(actor: AuthUser, dto: CreateVehicleDto): Promise<VehicleDto> {
    return this.prisma.$transaction(async (tx) => {
      const row = await tx.vehicle.create({
        data: {
          orgId: actor.orgId,
          regNo: normalizeRegNo(dto.regNo),
          type: dto.type.trim(),
          make: dto.make ?? null,
          model: dto.model ?? null,
          seats: dto.seats,
          gpsDeviceId: dto.gpsDeviceId?.trim() || null,
        },
      });
      await this.audit.record(tx, actor, {
        entity: 'vehicle',
        entityId: row.id,
        action: 'create',
        after: row,
      });
      return toDto(row);
    });
  }

  async update(actor: AuthUser, id: string, dto: UpdateVehicleDto): Promise<VehicleDto> {
    const before = await this.prisma.vehicle.findFirst({ where: { id, orgId: actor.orgId } });
    if (!before) throw new NotFoundException('Vehicle not found');
    return this.prisma.$transaction(async (tx) => {
      const row = await tx.vehicle.update({
        where: { id },
        data: {
          regNo: dto.regNo === undefined ? undefined : normalizeRegNo(dto.regNo),
          type: dto.type?.trim(),
          make: dto.make,
          model: dto.model,
          seats: dto.seats,
          status: dto.status,
          gpsDeviceId: dto.gpsDeviceId === undefined ? undefined : dto.gpsDeviceId?.trim() || null,
        },
      });
      await this.audit.record(tx, actor, {
        entity: 'vehicle',
        entityId: id,
        action: 'update',
        before,
        after: row,
      });
      return toDto(row);
    });
  }
}
