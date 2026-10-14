import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { RequestsModule } from '../requests/requests.module';
import { GpsIngestService } from './gps-ingest.service';
import { GpsWatchdogProcessor, TRACKING_QUEUE } from './gps-watchdog.processor';
import { GpsWebhookController } from './gps-webhook.controller';
import { LiveStateService } from './live-state.service';
import { LiveController } from './live.controller';
import { LiveService } from './live.service';
import { TripDetectorService } from './trip-detector.service';
import { TripLifecycleService } from './trip-lifecycle.service';

@Module({
  imports: [RequestsModule, BullModule.registerQueue({ name: TRACKING_QUEUE })],
  controllers: [GpsWebhookController, LiveController],
  providers: [
    LiveStateService,
    GpsIngestService,
    TripDetectorService,
    TripLifecycleService,
    LiveService,
    GpsWatchdogProcessor,
  ],
})
export class TrackingModule {}
