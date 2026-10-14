import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import type { AuthUser } from '../auth/auth.types';
import { CurrentUser, Roles } from '../auth/decorators';
import { CreateVehicleDto, UpdateVehicleDto, VehicleDto } from './vehicles.dto';
import { VehiclesService } from './vehicles.service';

@ApiTags('vehicles')
@ApiBearerAuth()
@Roles('super_admin', 'transport_manager')
@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehicles: VehiclesService) {}

  @Get()
  @ApiOkResponse({ type: VehicleDto, isArray: true })
  list(@CurrentUser() user: AuthUser): Promise<VehicleDto[]> {
    return this.vehicles.list(user);
  }

  @Post()
  @ApiCreatedResponse({ type: VehicleDto })
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateVehicleDto): Promise<VehicleDto> {
    return this.vehicles.create(user, dto);
  }

  @Patch(':id')
  @ApiOkResponse({ type: VehicleDto })
  update(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateVehicleDto,
  ): Promise<VehicleDto> {
    return this.vehicles.update(user, id, dto);
  }
}
