import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import type { AuthUser } from '../auth/auth.types';
import { CurrentUser, Roles } from '../auth/decorators';
import { CreateDriverDto, UpdateDriverDto, DriverDto } from './drivers.dto';
import { DriversService } from './drivers.service';

@ApiTags('drivers')
@ApiBearerAuth()
@Roles('super_admin', 'transport_manager')
@Controller('drivers')
export class DriversController {
  constructor(private readonly drivers: DriversService) {}

  @Get()
  @ApiOkResponse({ type: DriverDto, isArray: true })
  list(@CurrentUser() user: AuthUser): Promise<DriverDto[]> {
    return this.drivers.list(user);
  }

  @Post()
  @ApiCreatedResponse({ type: DriverDto })
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateDriverDto): Promise<DriverDto> {
    return this.drivers.create(user, dto);
  }

  @Patch(':id')
  @ApiOkResponse({ type: DriverDto })
  update(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateDriverDto,
  ): Promise<DriverDto> {
    return this.drivers.update(user, id, dto);
  }
}
