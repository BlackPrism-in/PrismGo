import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { PlaceDto, PlaceSearchQuery } from './places.dto';
import { PlacesService } from './places.service';

@ApiTags('places')
@ApiBearerAuth()
@Controller('places')
export class PlacesController {
  constructor(private readonly places: PlacesService) {}

  /** Signed-in users: address suggestions for pickup and drop. */
  @Get('search')
  @Throttle({ default: { limit: 60, ttl: 60_000 } })
  @ApiOkResponse({ type: PlaceDto, isArray: true })
  search(@Query() query: PlaceSearchQuery): Promise<PlaceDto[]> {
    return this.places.search(query.q);
  }
}
