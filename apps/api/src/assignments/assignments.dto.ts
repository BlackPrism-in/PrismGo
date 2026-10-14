import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsOptional, IsUUID, Max, Min } from 'class-validator';

export class AvailabilityQuery {
  @ApiProperty({ format: 'date-time' })
  @IsDateString()
  from: string;

  @ApiProperty({ format: 'date-time' })
  @IsDateString()
  to: string;

  @ApiPropertyOptional({ description: 'Marks vehicles with too few seats' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(60)
  passengers?: number;
}

export class ConflictDto {
  @ApiProperty({ example: 'PG-1041' }) requestCode: string;
  @ApiProperty() requestId: string;
  @ApiProperty({ format: 'date-time' }) from: Date;
  @ApiProperty({ format: 'date-time' }) to: Date;
}

export class AvailableVehicleDto {
  @ApiProperty() id: string;
  @ApiProperty() regNo: string;
  @ApiProperty() type: string;
  @ApiProperty() seats: number;
  @ApiProperty() available: boolean;
  @ApiProperty({ description: 'Seats >= passengers' }) fits: boolean;
  @ApiPropertyOptional({ type: ConflictDto, nullable: true }) conflict: ConflictDto | null;
}

export class AvailableDriverDto {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiProperty() phone: string;
  @ApiPropertyOptional({ type: String, nullable: true }) defaultVehicleId: string | null;
  @ApiProperty() available: boolean;
  @ApiPropertyOptional({ type: ConflictDto, nullable: true }) conflict: ConflictDto | null;
}

export class AvailabilityDto {
  @ApiProperty({ type: AvailableVehicleDto, isArray: true }) vehicles: AvailableVehicleDto[];
  @ApiProperty({ type: AvailableDriverDto, isArray: true }) drivers: AvailableDriverDto[];
}

export class AssignDto {
  @ApiProperty()
  @IsUUID()
  vehicleId: string;

  @ApiProperty()
  @IsUUID()
  driverId: string;

  @ApiPropertyOptional({
    type: String,
    nullable: true,
    format: 'date-time',
    description:
      'When the vehicle is free again. Defaults to the return time, else pickup + 2 hours.',
  })
  @IsOptional()
  @IsDateString()
  scheduledEnd?: string | null;
}

export class ReassignDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  vehicleId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  driverId?: string;
}
