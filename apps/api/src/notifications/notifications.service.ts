import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import type { Queue } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { RealtimeGateway, rooms } from '../realtime/realtime.gateway';
import type { Message } from './messages';

export const OUTBOX_QUEUE = 'outbox';

export interface OutboxJob {
  notificationId: string;
  phone: string;
  message: Message;
}

export interface Recipient {
  /** App user: gets an in-app notification and a live socket event. */
  userId?: string;
  /** Phone for WhatsApp. Users' own phone is used when omitted. */
  phone?: string;
}

/**
 * Fan-out for every workflow event: in-app row + socket push, then WhatsApp via a
 * queued job so a slow or failing provider never blocks or fails the request.
 * Call after the database transaction commits.
 */
@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly realtime: RealtimeGateway,
    @InjectQueue(OUTBOX_QUEUE) private readonly outbox: Queue<OutboxJob>,
  ) {}

  async notify(
    orgId: string,
    recipients: Recipient[],
    message: Message,
    context: { requestId?: string } = {},
  ): Promise<void> {
    const seen = new Set<string>();
    for (const r of recipients) {
      const key = r.userId ?? r.phone;
      if (!key || seen.has(key)) continue;
      seen.add(key);
      try {
        await this.deliver(orgId, r, message, context);
      } catch (err) {
        // A notification failure must never undo the business action.
        this.logger.error(`Notify ${message.template} → ${key} failed: ${(err as Error).message}`);
      }
    }
  }

  private async deliver(
    orgId: string,
    r: Recipient,
    message: Message,
    context: { requestId?: string },
  ): Promise<void> {
    const payload = {
      title: message.title,
      body: message.body,
      requestId: context.requestId ?? null,
    };
    let phone = r.phone;

    if (r.userId) {
      const user = await this.prisma.user.findUnique({ where: { id: r.userId } });
      if (!user || user.status !== 'active') return;
      phone ??= user.phone;
      const row = await this.prisma.notification.create({
        data: {
          orgId,
          userId: r.userId,
          channel: 'in_app',
          template: message.template,
          payload,
          status: 'sent',
          sentAt: new Date(),
        },
      });
      this.realtime.emit(rooms.user(r.userId), 'notification', {
        id: row.id,
        template: row.template,
        ...payload,
        readAt: null,
        createdAt: row.createdAt,
      });
    }

    if (phone) {
      const row = await this.prisma.notification.create({
        data: {
          orgId,
          userId: r.userId ?? null,
          recipientPhone: phone,
          channel: 'whatsapp',
          template: message.template,
          payload: { ...payload, params: message.whatsapp.params },
        },
      });
      await this.outbox.add(
        message.template,
        { notificationId: row.id, phone, message },
        { attempts: 5, backoff: { type: 'exponential', delay: 5_000 }, removeOnComplete: 1000 },
      );
    }
  }
}
