import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class SignupDepartmentDto {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
}

export class CreateAccessRequestDto {
  @ApiProperty({ example: 'Rahul Verma' })
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  name: string;

  @ApiProperty({ example: '9812345678', description: 'Indian mobile, any common format' })
  @IsString()
  phone: string;

  @ApiProperty({ description: 'From GET /access/departments' })
  @IsUUID()
  departmentId: string;

  @ApiPropertyOptional({ example: 'rahul@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;
}

export class AccessRequestReceivedDto {
  @ApiProperty({ example: true }) received: boolean;
}

export class AccessRequestDto {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiProperty({ example: '+919812345678' }) phone: string;
  @ApiPropertyOptional({ type: String, nullable: true }) email: string | null;
  @ApiPropertyOptional({ type: SignupDepartmentDto, nullable: true })
  department: SignupDepartmentDto | null;
  @ApiProperty({ format: 'date-time' }) requestedAt: Date;
}
