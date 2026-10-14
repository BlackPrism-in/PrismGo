import { Logger } from '@nestjs/common';
import type { OtpSender } from './otp-sender';

/** Development only: prints the code to the API log. */
export class ConsoleOtpSender implements OtpSender {
  readonly name = 'console';
  private readonly logger = new Logger('OTP');

  async send(phone: string, code: string): Promise<void> {
    this.logger.warn(`Login code for ${phone}: ${code}`);
  }
}
