import { BullModule } from '@nestjs/bullmq';
import { Global, Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { isLiveProduction } from '../config/env';
import { ConsoleMessenger, MESSENGER, WhatsAppMessenger, type Messenger } from './messenger';
import { DevicesController } from './devices.controller';
import { NotificationsController } from './notifications.controller';
import { NotificationsService, OUTBOX_QUEUE } from './notifications.service';
import { OutboxProcessor } from './outbox.processor';
import {
  FcmPushSender,
  LogPushSender,
  parseServiceAccount,
  PUSH_SENDER,
  type PushSender,
} from './push';
import { PUSH_QUEUE, PushProcessor } from './push.processor';

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

/**
 * Push via FCM when FCM_SERVICE_ACCOUNT_JSON is set; otherwise push is skipped.
 * A bad key turns push off with an error in the log instead of stopping the API:
 * login, requests, WhatsApp and in-app alerts don't depend on it.
 */
function buildPushSender(config: ConfigService): PushSender {
  const raw = config.get<string>('FCM_SERVICE_ACCOUNT_JSON')?.trim();
  if (!raw) return new LogPushSender();
  try {
    return new FcmPushSender(parseServiceAccount(raw));
  } catch (err) {
    new Logger('Push').error(`Push disabled: ${(err as Error).message}`);
    return new LogPushSender();
  }
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
    BullModule.registerQueue({ name: OUTBOX_QUEUE }, { name: PUSH_QUEUE }),
  ],
  controllers: [NotificationsController, DevicesController],
  providers: [
    NotificationsService,
    OutboxProcessor,
    PushProcessor,
    { provide: PUSH_SENDER, inject: [ConfigService], useFactory: buildPushSender },
    { provide: MESSENGER, inject: [ConfigService], useFactory: buildMessenger },
  ],
  exports: [NotificationsService],
})
export class NotificationsModule {}
