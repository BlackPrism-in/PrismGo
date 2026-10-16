import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject, Logger } from '@nestjs/common';
import type { Job } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { PUSH_SENDER, type PushMessage, type PushSender } from './push';

export const PUSH_QUEUE = 'push';

export interface PushJob {
  token: string;
  message: PushMessage;
}

/** Sends queued push notifications, one device per job; drops tokens FCM no longer knows. */
@Processor(PUSH_QUEUE)
export class PushProcessor extends WorkerHost {
  private readonly logger = new Logger(PushProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(PUSH_SENDER) private readonly sender: PushSender,
  ) {
    super();
  }

  async process(job: Job<PushJob>): Promise<void> {
    const { token, message } = job.data;
    const result = await this.sender.send(token, message);
    if (result === 'invalid-token') {
      await this.prisma.deviceToken.deleteMany({ where: { token } });
      this.logger.log(`Removed stale device token …${token.slice(-6)}`);
    }
  }
}
