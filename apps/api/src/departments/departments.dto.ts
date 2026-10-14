import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class CreateDepartmentDto {
  @ApiProperty({ example: 'Operations' })
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  name: string;

  @ApiPropertyOptional({ example: 'CC-104' })
  @IsOptional()
  @IsString()
  @MaxLength(40)
  costCentre?: string;

  @ApiPropertyOptional({
    type: String,
    nullable: true,
    description: 'User id of the HOD; the user must hold the hod role',
  })
  @IsOptional()
  @IsUUID()
  hodUserId?: string | null;
}

export class UpdateDepartmentDto extends PartialType(CreateDepartmentDto) {}

export class DepartmentHodDto {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiProperty() phone: string;
}

export class DepartmentDto {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiPropertyOptional({ type: String, nullable: true }) costCentre: string | null;
  @ApiPropertyOptional({ type: DepartmentHodDto, nullable: true }) hod: DepartmentHodDto | null;
  @ApiProperty() memberCount: number;
}
