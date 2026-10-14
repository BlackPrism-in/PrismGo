import { ApiProperty, ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger';
import { REQUEST_STATUSES, type RequestStatus } from '@prismgo/shared';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsIn,
  IsInt,
  IsLatitude,
  IsLongitude,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class LocationDto {
  @ApiProperty({ example: 'Terminal 1, Kempegowda International Airport, Bengaluru' })
  @IsString()
  @MinLength(3)
  @MaxLength(300)
  address: string;

  @ApiProperty({ example: 13.1989 })
  @IsLatitude()
  lat: number;

  @ApiProperty({ example: 77.7068 })
  @IsLongitude()
  lng: number;
}

export class CreateRequestDto {
  @ApiProperty({ type: LocationDto })
  @ValidateNested()
  @Type(() => LocationDto)
  pickup: LocationDto;

  @ApiProperty({ type: LocationDto })
  @ValidateNested()
  @Type(() => LocationDto)
  drop: LocationDto;

  @ApiProperty({ format: 'date-time', example: '2026-10-20T09:30:00+05:30' })
  @IsDateString()
  startAt: string;

  @ApiPropertyOptional({
    type: String,
    nullable: true,
    format: 'date-time',
    description: 'Return trip time, if any',
  })
  @IsOptional()
  @IsDateString()
  returnAt?: string | null;

  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(1)
  @Max(60)
  passengers: number;

  @ApiProperty({ example: 'Client meeting at airport hotel' })
  @IsString()
  @MinLength(3)
  @MaxLength(300)
  purpose: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string | null;

  @ApiPropertyOptional({ description: 'Defaults to true; false saves a draft' })
  @IsOptional()
  @IsBoolean()
  submit?: boolean;
}

export class UpdateRequestDto extends PartialType(
  OmitType(CreateRequestDto, ['submit'] as const),
) {}

export class ApproveDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  comment?: string;
}

export class RejectDto {
  @ApiProperty({ example: 'Please use the shuttle for this route' })
  @IsString()
  @MinLength(3)
  @MaxLength(500)
  comment: string;
}

export class CancelDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;
}

export const REQUEST_SCOPES = ['mine', 'approvals', 'all'] as const;
export type RequestScope = (typeof REQUEST_SCOPES)[number];

export class ListRequestsQuery {
  @ApiPropertyOptional({
    enum: REQUEST_SCOPES,
    enumName: 'RequestScope',
    description: 'mine: my requests · approvals: departments I head · all: managers only',
  })
  @IsOptional()
  @IsIn(REQUEST_SCOPES)
  scope?: RequestScope;

  @ApiPropertyOptional({ enum: REQUEST_STATUSES, enumName: 'RequestStatus' })
  @IsOptional()
  @IsIn(REQUEST_STATUSES)
  status?: RequestStatus;
}

// ─── Responses ──────────────────────────────────────────────────────────────

export class PersonDto {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiProperty() phone: string;
}

export class NamedDto {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
}

export class TripVehicleDto {
  @ApiProperty() id: string;
  @ApiProperty() regNo: string;
  @ApiProperty() type: string;
  @ApiProperty() seats: number;
}

export class TripSummaryDto {
  @ApiProperty() id: string;
  @ApiProperty({
    enum: ['scheduled', 'in_progress', 'completed', 'cancelled'],
    enumName: 'TripStatus',
  })
  status: string;
  @ApiProperty({ type: TripVehicleDto }) vehicle: TripVehicleDto;
  @ApiProperty({ type: PersonDto }) driver: PersonDto;
  @ApiProperty({ format: 'date-time' }) scheduledStart: Date;
  @ApiProperty({ format: 'date-time' }) scheduledEnd: Date;
}

export const TIMELINE_TYPES = [
  'created',
  'submitted',
  'auto_approved',
  'approved',
  'rejected',
  'assigned',
  'reassigned',
  'started',
  'picked_up',
  'dropped',
  'ended',
  'gps_lost',
  'cancelled',
] as const;

export class TimelineEntryDto {
  @ApiProperty({ enum: TIMELINE_TYPES, enumName: 'TimelineType' })
  type: (typeof TIMELINE_TYPES)[number];
  @ApiProperty({ format: 'date-time' }) at: Date;
  @ApiPropertyOptional({ type: String, nullable: true }) actorName: string | null;
  @ApiPropertyOptional({ type: String, nullable: true }) note: string | null;
}

export class RequestDto {
  @ApiProperty() id: string;
  @ApiProperty({ example: 'PG-1042' }) code: string;
  @ApiProperty({ enum: REQUEST_STATUSES, enumName: 'RequestStatus' }) status: RequestStatus;
  @ApiProperty({ type: PersonDto }) requester: PersonDto;
  @ApiProperty({ type: NamedDto }) department: NamedDto;
  @ApiProperty({ type: LocationDto }) pickup: LocationDto;
  @ApiProperty({ type: LocationDto }) drop: LocationDto;
  @ApiProperty({ format: 'date-time' }) startAt: Date;
  @ApiPropertyOptional({ type: String, nullable: true, format: 'date-time' }) returnAt: Date | null;
  @ApiProperty() passengers: number;
  @ApiProperty() purpose: string;
  @ApiPropertyOptional({ type: String, nullable: true }) notes: string | null;
  @ApiPropertyOptional({ type: String, nullable: true }) cancelReason: string | null;
  @ApiPropertyOptional({
    type: TripSummaryDto,
    nullable: true,
    description: 'Current (non-cancelled) trip',
  })
  trip: TripSummaryDto | null;
  @ApiProperty({ type: TimelineEntryDto, isArray: true }) timeline: TimelineEntryDto[];
  @ApiProperty({
    description: 'What the signed-in user may do now',
    type: [String],
    example: ['cancel'],
  })
  actions: string[];
  @ApiProperty({ format: 'date-time' }) createdAt: Date;
}
