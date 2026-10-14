import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

/**
 * PrismGo's own GPS point format. The vendor adapter (or the vendor's webhook,
 * if it can be configured) maps tracker data into this.
 */
export class GpsPointDto {
  @ApiProperty({ example: 'SIM-001', description: "Tracker id in the vendor's system" })
  @IsString()
  @MaxLength(64)
  deviceId: string;

  @ApiProperty({ format: 'date-time' })
  @IsDateString()
  recordedAt: string;

  @ApiProperty({ example: 12.9756 })
  @IsLatitude()
  lat: number;

  @ApiProperty({ example: 77.6066 })
  @IsLongitude()
  lng: number;

  @ApiPropertyOptional({ example: 32.5 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(300)
  speedKmh?: number;

  @ApiPropertyOptional({ example: 45 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(360)
  heading?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  ignition?: boolean;

  @ApiPropertyOptional({ example: 18342.7 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  odometerKm?: number;
}

export class GpsBatchDto {
  @ApiProperty({ type: GpsPointDto, isArray: true })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(1000)
  @ValidateNested({ each: true })
  @Type(() => GpsPointDto)
  points: GpsPointDto[];
}

export class GpsIngestResultDto {
  @ApiProperty() accepted: number;
  @ApiProperty({ description: 'Already stored (same vehicle and time)' }) duplicates: number;
  @ApiProperty({ description: 'Too old, in the future, or for an unknown device' })
  rejected: number;
  @ApiProperty({ type: [String], description: 'Device ids not linked to any vehicle' })
  unknownDevices: string[];
}

export class PositionDto {
  @ApiProperty() lat: number;
  @ApiProperty() lng: number;
  @ApiPropertyOptional({ type: Number, nullable: true }) speedKmh: number | null;
  @ApiPropertyOptional({ type: Number, nullable: true }) heading: number | null;
  @ApiProperty({ format: 'date-time' }) recordedAt: string;
}

export const ETA_TARGETS = ['pickup', 'drop'] as const;

export class LiveTripDto {
  @ApiProperty() id: string;
  @ApiProperty() requestId: string;
  @ApiProperty({ example: 'PG-1001' }) code: string;
  @ApiProperty({ enum: ['scheduled', 'in_progress'], enumName: 'LiveTripStatus' }) status:
    'scheduled' | 'in_progress';
  @ApiProperty() requesterName: string;
  @ApiProperty() pickupAddress: string;
  @ApiProperty() dropAddress: string;
  @ApiProperty({ format: 'date-time' }) scheduledStart: Date;
  @ApiPropertyOptional({
    type: Number,
    nullable: true,
    description: 'Straight-line estimate until Google Directions is configured',
  })
  etaMinutes: number | null;
  @ApiProperty({ enum: ETA_TARGETS, enumName: 'EtaTarget' }) etaTo: (typeof ETA_TARGETS)[number];
}

export class LiveVehicleDto {
  @ApiProperty() id: string;
  @ApiProperty() regNo: string;
  @ApiProperty() type: string;
  @ApiProperty({
    enum: ['available', 'on_trip', 'maintenance', 'inactive'],
    enumName: 'VehicleStatus',
  })
  status: string;
  @ApiPropertyOptional({ type: String, nullable: true }) gpsDeviceId: string | null;
  @ApiPropertyOptional({ type: PositionDto, nullable: true }) position: PositionDto | null;
  @ApiProperty({ description: 'No position in the last 5 minutes' }) stale: boolean;
  @ApiPropertyOptional({
    type: LiveTripDto,
    nullable: true,
    description: 'In progress, or the next one within an hour',
  })
  trip: LiveTripDto | null;
}

export class TrackPointDto {
  @ApiProperty() lat: number;
  @ApiProperty() lng: number;
  @ApiProperty({ format: 'date-time' }) at: Date;
}

export class TripTrackDto {
  @ApiProperty() tripId: string;
  @ApiProperty() requestId: string;
  @ApiProperty({
    enum: ['scheduled', 'in_progress', 'completed', 'cancelled'],
    enumName: 'TripStatus',
  })
  status: string;
  @ApiProperty() vehicleRegNo: string;
  @ApiProperty() pickup: TrackPointDto;
  @ApiProperty() drop: TrackPointDto;
  @ApiProperty({
    type: TrackPointDto,
    isArray: true,
    description: 'Driven path (at most 2000 points)',
  })
  points: TrackPointDto[];
  @ApiPropertyOptional({ type: PositionDto, nullable: true }) position: PositionDto | null;
  @ApiPropertyOptional({ type: Number, nullable: true }) etaMinutes: number | null;
  @ApiProperty({ enum: ETA_TARGETS, enumName: 'EtaTarget' }) etaTo: (typeof ETA_TARGETS)[number];
}
