import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { DRIVER_STATUSES, type DriverStatus } from '@prismgo/shared';
import {
  IsDateString,
  IsIn,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateDriverDto {
  @ApiProperty({ example: 'Suresh Kumar' })
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  name: string;

  @ApiProperty({ example: '9812345678' })
  @IsString()
  phone: string;

  @ApiProperty({ example: 'KA0120190012345' })
  @IsString()
  @MinLength(5)
  @MaxLength(30)
  licenceNo: string;

  @ApiPropertyOptional({ type: String, nullable: true, example: '2030-03-31', format: 'date' })
  @IsOptional()
  @IsDateString()
  licenceExpiry?: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  @IsOptional()
  @IsUUID()
  defaultVehicleId?: string | null;
}

export class UpdateDriverDto extends PartialType(CreateDriverDto) {
  @ApiPropertyOptional({ enum: DRIVER_STATUSES, enumName: 'DriverStatus' })
  @IsOptional()
  @IsIn(DRIVER_STATUSES)
  status?: DriverStatus;
}

export class DriverVehicleDto {
  @ApiProperty() id: string;
  @ApiProperty() regNo: string;
}

export class DriverDto {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiProperty() phone: string;
  @ApiProperty() licenceNo: string;
  @ApiPropertyOptional({ type: String, nullable: true, format: 'date' })
  licenceExpiry: string | null;
  @ApiProperty({ enum: DRIVER_STATUSES, enumName: 'DriverStatus' }) status: DriverStatus;
  @ApiPropertyOptional({ type: DriverVehicleDto, nullable: true })
  defaultVehicle: DriverVehicleDto | null;
}
