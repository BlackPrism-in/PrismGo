import type { OtpSender } from './otp-sender';

/**
 * Sends the code with a WhatsApp Cloud API authentication template.
 * The template (default name "login_code") must be approved in Meta Business Manager
 * with one body parameter and a copy-code button.
 */
export class WhatsAppOtpSender implements OtpSender {
  readonly name = 'whatsapp';

  constructor(
    private readonly phoneNumberId: string,
    private readonly accessToken: string,
    private readonly templateName = 'login_code',
    private readonly languageCode = 'en',
  ) {}

  async send(phone: string, code: string): Promise<void> {
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
          name: this.templateName,
          language: { code: this.languageCode },
          components: [
            { type: 'body', parameters: [{ type: 'text', text: code }] },
            {
              type: 'button',
              sub_type: 'url',
              index: '0',
              parameters: [{ type: 'text', text: code }],
            },
          ],
        },
      }),
    });
    if (!res.ok) {
      throw new Error(`WhatsApp send failed: ${res.status} ${await res.text()}`);
    }
  }
}
