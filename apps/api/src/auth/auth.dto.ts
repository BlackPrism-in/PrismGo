import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ROLES, type Role } from '@prismgo/shared';
import { IsOptional, IsString, Length, Matches } from 'class-validator';

export class RequestOtpDto {
  @ApiProperty({ example: '9812345678', description: 'Indian mobile, any common format' })
  @IsString()
  phone: string;
}

export class RequestOtpResponseDto {
  @ApiProperty({ example: true })
  sent: boolean;

  @ApiPropertyOptional({ description: 'Only in development with the console sender' })
  devCode?: string;
}

export class VerifyOtpDto {
  @ApiProperty({ example: '9812345678' })
  @IsString()
  phone: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @Length(6, 6)
  @Matches(/^\d{6}$/)
  code: string;
}

export class RefreshDto {
  @ApiPropertyOptional({ description: 'Mobile sends it here; web uses the httpOnly cookie' })
  @IsOptional()
  @IsString()
  refreshToken?: string;
}

export class MeDepartmentDto {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
}

export class MeDto {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiProperty({ example: '+919812345678' }) phone: string;
  @ApiPropertyOptional({ type: String, nullable: true }) email: string | null;
  @ApiProperty({ enum: ROLES, isArray: true, enumName: 'Role' }) roles: Role[];
  @ApiPropertyOptional({ type: MeDepartmentDto, nullable: true })
  department: MeDepartmentDto | null;
  @ApiProperty() orgId: string;
  @ApiProperty() orgName: string;
}

export class AuthResponseDto {
  @ApiProperty() accessToken: string;
  @ApiPropertyOptional({ description: 'Omitted for web clients (sent as an httpOnly cookie)' })
  refreshToken?: string;
  @ApiProperty({ description: 'Access token lifetime in seconds' }) expiresIn: number;
  @ApiProperty({ type: MeDto }) user: MeDto;
}
