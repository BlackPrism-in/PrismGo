import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import type { AuthUser } from '../auth/auth.types';
import { CurrentUser, Roles } from '../auth/decorators';
import { CreateDepartmentDto, DepartmentDto, UpdateDepartmentDto } from './departments.dto';
import { DepartmentsService } from './departments.service';

@ApiTags('departments')
@ApiBearerAuth()
@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departments: DepartmentsService) {}

  /** Any signed-in user: forms need the department list. */
  @Get()
  @ApiOkResponse({ type: DepartmentDto, isArray: true })
  list(@CurrentUser() user: AuthUser): Promise<DepartmentDto[]> {
    return this.departments.list(user);
  }

  @Post()
  @Roles('super_admin', 'transport_manager')
  @ApiCreatedResponse({ type: DepartmentDto })
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateDepartmentDto): Promise<DepartmentDto> {
    return this.departments.create(user, dto);
  }

  @Patch(':id')
  @Roles('super_admin', 'transport_manager')
  @ApiOkResponse({ type: DepartmentDto })
  update(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateDepartmentDto,
  ): Promise<DepartmentDto> {
    return this.departments.update(user, id, dto);
  }
}
