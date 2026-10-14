import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { ROLES, type Role } from '@prismgo/shared';
import {
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export const USER_STATUSES = ['active', 'inactive'] as const;
export type UserStatus = (typeof USER_STATUSES)[number];

export class CreateUserDto {
  @ApiProperty({ example: 'Rahul Verma' })
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  name: string;

  @ApiProperty({ example: '9812345678', description: 'Indian mobile; stored as +91XXXXXXXXXX' })
  @IsString()
  phone: string;

  @ApiPropertyOptional({ type: String, nullable: true, example: 'rahul@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string | null;

  @ApiProperty({ enum: ROLES, isArray: true, enumName: 'Role', example: ['requester'] })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique()
  @IsIn(ROLES, { each: true })
  roles: Role[];

  @ApiPropertyOptional({ type: String, nullable: true })
  @IsOptional()
  @IsUUID()
  departmentId?: string | null;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({ enum: USER_STATUSES, enumName: 'UserStatus' })
  @IsOptional()
  @IsIn(USER_STATUSES)
  status?: UserStatus;
}

export class UserDepartmentDto {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
}

export class UserDto {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiProperty({ example: '+919812345678' }) phone: string;
  @ApiPropertyOptional({ type: String, nullable: true }) email: string | null;
  @ApiProperty({ enum: ROLES, isArray: true, enumName: 'Role' }) roles: Role[];
  @ApiProperty({ enum: USER_STATUSES, enumName: 'UserStatus' }) status: UserStatus;
  @ApiPropertyOptional({ type: UserDepartmentDto, nullable: true })
  department: UserDepartmentDto | null;
  @ApiPropertyOptional({ type: String, nullable: true, format: 'date-time' })
  lastLoginAt: Date | null;
}

export class ListUsersQuery {
  @ApiPropertyOptional({ enum: ROLES, enumName: 'Role' })
  @IsOptional()
  @IsIn(ROLES)
  role?: Role;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  departmentId?: string;

  @ApiPropertyOptional({ enum: USER_STATUSES, enumName: 'UserStatus' })
  @IsOptional()
  @IsIn(USER_STATUSES)
  status?: UserStatus;

  @ApiPropertyOptional({ description: 'Matches name or phone' })
  @IsOptional()
  @IsString()
  q?: string;
}
