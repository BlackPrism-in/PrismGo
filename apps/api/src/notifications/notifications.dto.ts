import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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
