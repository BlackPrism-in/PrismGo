/** Delivers a login code to a phone. Implementations: console (dev), WhatsApp, SMS. */
export interface OtpSender {
  readonly name: string;
  send(phoneE164: string, code: string): Promise<void>;
}

export const OTP_SENDERS = Symbol('OTP_SENDERS');
