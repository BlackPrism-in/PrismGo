import { Logger } from '@nestjs/common';
import type { Message } from './messages';

/** Sends a message to a phone outside the app (WhatsApp in production). */
export interface Messenger {
  readonly name: string;
  send(phoneE164: string, message: Message): Promise<void>;
}

export const MESSENGER = Symbol('MESSENGER');

/** Development: logs what would be sent. */
export class ConsoleMessenger implements Messenger {
  readonly name = 'console';
  private readonly logger = new Logger('WhatsApp');

  async send(phone: string, message: Message): Promise<void> {
    this.logger.log(`→ ${phone} [${message.whatsapp.template}] ${message.title} — ${message.body}`);
  }
}

/** WhatsApp Cloud API template message. */
export class WhatsAppMessenger implements Messenger {
  readonly name = 'whatsapp';

  constructor(
    private readonly phoneNumberId: string,
    private readonly accessToken: string,
    private readonly languageCode = 'en',
  ) {}

  async send(phone: string, message: Message): Promise<void> {
    const res = await fetch(`https://graph.facebook.com/v21.0/${this.phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: phone.replace('+', ''),
        type: 'template',
        template: {
          name: message.whatsapp.template,
          language: { code: this.languageCode },
          components: [
            {
              type: 'body',
              parameters: message.whatsapp.params.map((text) => ({ type: 'text', text })),
            },
          ],
        },
      }),
    });
    if (!res.ok) throw new Error(`WhatsApp ${res.status}: ${await res.text()}`);
  }
}
