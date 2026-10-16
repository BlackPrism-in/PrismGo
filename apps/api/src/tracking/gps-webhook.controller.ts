import {
  Body,
  Controller,
  Get,
  Header,
  Headers,
  HttpCode,
  Post,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiExcludeEndpoint, ApiHeader, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { timingSafeEqual } from 'node:crypto';
import { Public } from '../auth/decorators';
import { GpsIngestService } from './gps-ingest.service';
import { GpsBatchDto, GpsIngestResultDto } from './tracking.dto';

/**
 * Where tracker positions arrive: the GPS vendor's push (webhook), our polling
 * adapter, or the dev simulator. Authenticated with a shared secret header.
 */
@ApiTags('gps')
@Public()
@SkipThrottle()
@Controller('gps')
export class GpsWebhookController {
  constructor(
    private readonly ingestService: GpsIngestService,
    private readonly config: ConfigService,
  ) {}

  /** Opening the URL in a browser (or a vendor's reachability check) explains itself. */
  @Get('webhook')
  @HttpCode(405)
  @Header('Allow', 'POST')
  @ApiExcludeEndpoint()
  describe(): { statusCode: number; message: string } {
    return {
      statusCode: 405,
      message: 'PrismGo GPS webhook is up. Send positions with POST and the X-GPS-Secret header.',
    };
  }

  @Post('webhook')
  @HttpCode(200)
  @ApiHeader({ name: 'X-GPS-Secret', required: true })
  @ApiOkResponse({ type: GpsIngestResultDto })
  ingest(
    @Headers('x-gps-secret') secret: string | undefined,
    @Body() batch: GpsBatchDto,
  ): Promise<GpsIngestResultDto> {
    const expected = this.config.get<string>('GPS_WEBHOOK_SECRET');
    if (!expected) throw new ServiceUnavailableException('GPS ingestion is not configured');
    const a = Buffer.from(secret ?? '');
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) throw new UnauthorizedException();
    return this.ingestService.ingest(batch.points);
  }
}
