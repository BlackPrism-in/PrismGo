import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject, Logger } from '@nestjs/common';
import type { Job } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { MESSENGER, type Messenger } from './messenger';
import { OUTBOX_QUEUE, type OutboxJob } from './notifications.service';

/** Sends queued WhatsApp messages; BullMQ retries failures with backoff. */
@Processor(OUTBOX_QUEUE)
export class OutboxProcessor extends WorkerHost {
  private readonly logger = new Logger(OutboxProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(MESSENGER) private readonly messenger: Messenger,
  ) {
    super();
  }

  async process(job: Job<OutboxJob>): Promise<void> {
    const { notificationId, phone, message } = job.data;
    try {
      await this.messenger.send(phone, message);
      await this.prisma.notification.update({
        where: { id: notificationId },
        data: { status: 'sent', sentAt: new Date(), error: null },
      });
    } catch (err) {
      const error = (err as Error).message.slice(0, 500);
      const final = job.attemptsMade + 1 >= (job.opts.attempts ?? 1);
      await this.prisma.notification.update({
        where: { id: notificationId },
        data: { status: final ? 'failed' : 'queued', error },
      });
      this.logger.warn(
        `Outbox ${message.template} → ${phone} attempt ${job.attemptsMade + 1}: ${error}`,
      );
      throw err;
    }
  }
}
