import {
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import type { AuthUser } from '../auth/auth.types';
import { CurrentUser, Roles } from '../auth/decorators';
import { PrismaService } from '../prisma/prisma.service';
import { RequestDto } from '../requests/requests.dto';
import { RequestsService } from '../requests/requests.service';
import { LiveService } from './live.service';
import { LiveVehicleDto, TripTrackDto } from './tracking.dto';
import { TripLifecycleService } from './trip-lifecycle.service';

@ApiTags('live')
@ApiBearerAuth()
@Controller()
export class LiveController {
  constructor(
    private readonly liveService: LiveService,
    private readonly lifecycle: TripLifecycleService,
    private readonly requests: RequestsService,
    private readonly prisma: PrismaService,
  ) {}

  @Get('live/vehicles')
  @Roles('transport_manager', 'super_admin')
  @ApiOkResponse({ type: LiveVehicleDto, isArray: true })
  vehicles(@CurrentUser() user: AuthUser): Promise<LiveVehicleDto[]> {
    return this.liveService.vehicles(user);
  }

  @Get('trips/:id/track')
  @ApiOkResponse({ type: TripTrackDto })
  track(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<TripTrackDto> {
    return this.liveService.track(user, id);
  }

  /** Manager override when the tracker can't tell (no GPS, odd route). */
  @Post('trips/:id/start')
  @HttpCode(200)
  @Roles('transport_manager', 'super_admin')
  @ApiOkResponse({ type: RequestDto })
  async start(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<RequestDto> {
    const requestId = await this.requestIdFor(user, id);
    await this.lifecycle.start(id, { source: 'manager', actor: user, at: new Date() });
    return this.requests.get(user, requestId);
  }

  @Post('trips/:id/end')
  @HttpCode(200)
  @Roles('transport_manager', 'super_admin')
  @ApiOkResponse({ type: RequestDto })
  async end(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<RequestDto> {
    const requestId = await this.requestIdFor(user, id);
    await this.lifecycle.end(id, { source: 'manager', actor: user, at: new Date() });
    return this.requests.get(user, requestId);
  }

  private async requestIdFor(user: AuthUser, tripId: string): Promise<string> {
    const trip = await this.prisma.trip.findFirst({ where: { id: tripId, orgId: user.orgId } });
    if (!trip) throw new NotFoundException('Trip not found');
    return trip.requestId;
  }
}
