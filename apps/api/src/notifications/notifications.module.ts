import { BullModule } from '@nestjs/bullmq';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { isLiveProduction } from '../config/env';
import { ConsoleMessenger, MESSENGER, WhatsAppMessenger, type Messenger } from './messenger';
import { NotificationsController } from './notifications.controller';
import { NotificationsService, OUTBOX_QUEUE } from './notifications.service';
import { OutboxProcessor } from './outbox.processor';

/** MESSAGING_PROVIDER: "console" (dev, default) or "whatsapp". */
function buildMessenger(config: ConfigService): Messenger {
  const provider = config.get<string>('MESSAGING_PROVIDER') ?? 'console';
  if (provider === 'whatsapp') {
    return new WhatsAppMessenger(
      config.getOrThrow('WHATSAPP_PHONE_NUMBER_ID'),
      config.getOrThrow('WHATSAPP_ACCESS_TOKEN'),
    );
  }
  if (provider === 'console') {
    if (isLiveProduction((k) => config.get(k))) {
      throw new Error(
        'MESSAGING_PROVIDER=console is not allowed in production (use APP_ENV=staging for UAT)',
      );
    }
    return new ConsoleMessenger();
  }
  throw new Error(`Unknown MESSAGING_PROVIDER "${provider}"`);
}

@Global()
@Module({
  imports: [
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: { url: config.getOrThrow<string>('REDIS_URL') },
        // Keyed by database so dev, test and other environments sharing a Redis
        // never process each other's jobs.
        prefix: `prismgo:${new URL(config.getOrThrow<string>('DATABASE_URL')).pathname.slice(1)}`,
      }),
    }),
    BullModule.registerQueue({ name: OUTBOX_QUEUE }),
  ],
  controllers: [NotificationsController],
  providers: [
    NotificationsService,
    OutboxProcessor,
    { provide: MESSENGER, inject: [ConfigService], useFactory: buildMessenger },
  ],
  exports: [NotificationsService],
})
export class NotificationsModule {}
