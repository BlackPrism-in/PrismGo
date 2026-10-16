import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsString, Length } from 'class-validator';

export class NotificationDto {
  @ApiProperty() id: string;
  @ApiProperty({ example: 'request_approved' }) template: string;
  @ApiProperty() title: string;
  @ApiProperty() body: string;
  @ApiPropertyOptional({ type: String, nullable: true }) requestId: string | null;
  @ApiPropertyOptional({ type: String, nullable: true, format: 'date-time' }) readAt: Date | null;
  @ApiProperty({ format: 'date-time' }) createdAt: Date;
}

export class UnreadCountDto {
  @ApiProperty() count: number;
}

export class RegisterDeviceDto {
  @ApiProperty({ description: 'FCM registration token' })
  @IsString()
  @Length(20, 4096)
  token: string;

  @ApiProperty({ enum: ['android', 'ios'] })
  @IsIn(['android', 'ios'])
  platform: 'android' | 'ios';
}
