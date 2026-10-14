import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { VEHICLE_STATUSES, type VehicleStatus } from '@prismgo/shared';
import { IsIn, IsInt, IsOptional, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';

export class CreateVehicleDto {
  @ApiProperty({ example: 'KA01AB1234', description: 'Stored uppercase without spaces' })
  @IsString()
  @MinLength(4)
  @MaxLength(15)
  regNo: string;

  @ApiProperty({ example: 'Sedan' })
  @IsString()
  @MaxLength(40)
  type: string;

  @ApiPropertyOptional({ type: String, nullable: true, example: 'Maruti' })
  @IsOptional()
  @IsString()
  @MaxLength(40)
  make?: string | null;

  @ApiPropertyOptional({ type: String, nullable: true, example: 'Dzire' })
  @IsOptional()
  @IsString()
  @MaxLength(40)
  model?: string | null;

  @ApiProperty({ example: 4 })
  @IsInt()
  @Min(1)
  @Max(60)
  seats: number;

  @ApiPropertyOptional({
    type: String,
    nullable: true,
    description: "The tracker's device id in the GPS vendor system",
  })
  @IsOptional()
  @IsString()
  @MaxLength(64)
  gpsDeviceId?: string | null;
}

export class UpdateVehicleDto extends PartialType(CreateVehicleDto) {
  @ApiPropertyOptional({ enum: VEHICLE_STATUSES, enumName: 'VehicleStatus' })
  @IsOptional()
  @IsIn(VEHICLE_STATUSES)
  status?: VehicleStatus;
}

export class VehicleDto {
  @ApiProperty() id: string;
  @ApiProperty() regNo: string;
  @ApiProperty() type: string;
  @ApiPropertyOptional({ type: String, nullable: true }) make: string | null;
  @ApiPropertyOptional({ type: String, nullable: true }) model: string | null;
  @ApiProperty() seats: number;
  @ApiProperty({ enum: VEHICLE_STATUSES, enumName: 'VehicleStatus' }) status: VehicleStatus;
  @ApiPropertyOptional({ type: String, nullable: true }) gpsDeviceId: string | null;
}
