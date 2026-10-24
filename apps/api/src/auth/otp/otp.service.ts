import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac, randomInt, timingSafeEqual } from 'node:crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { OTP_SENDERS, type OtpSender } from './otp-sender';

const MAX_ATTEMPTS = 5;
const MAX_CODES_PER_WINDOW = 3;
const WINDOW_MS = 10 * 60 * 1000;

@Injectable()
export class OtpService {
  private readonly logger = new Logger(OtpService.name);
  private readonly ttlMs: number;
  private readonly secret: string;
  /** Show console codes in the response: always in dev; in production builds only with OTP_EXPOSE_CODE. */
  private readonly exposeCode: boolean;
  /**
   * OTP_REVIEW_PHONES: numbers (+91XXXXXXXXXX) whose code is shown on screen instead of sent,
   * for app store reviewers who can't receive WhatsApp. Only where codes may be exposed.
   */
  private readonly reviewPhones: Set<string>;

  constructor(
    private readonly prisma: PrismaService,
    config: ConfigService,
    @Inject(OTP_SENDERS) private readonly senders: OtpSender[],
  ) {
    this.ttlMs = Number(config.get('OTP_TTL_SECONDS') ?? 300) * 1000;
    this.secret = config.getOrThrow<string>('JWT_REFRESH_SECRET');
    this.exposeCode =
      config.get('NODE_ENV') !== 'production' || config.get('OTP_EXPOSE_CODE') === 'true';
    this.reviewPhones = new Set(
      (config.get<string>('OTP_REVIEW_PHONES') ?? '')
        .split(',')
        .map((p) => p.trim())
        .filter(Boolean),
    );
  }

  /** Issues and delivers a code. Returns the code only for the console sender (dev). */
  async issue(phone: string): Promise<{ devCode?: string }> {
    const since = new Date(Date.now() - WINDOW_MS);
    const recent = await this.prisma.otpCode.count({
      where: { phone, createdAt: { gte: since } },
    });
    if (recent >= MAX_CODES_PER_WINDOW) {
      throw new HttpException(
        'Too many codes requested. Try again in a few minutes.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    const code = randomInt(0, 1_000_000).toString().padStart(6, '0');
    await this.prisma.otpCode.create({
      data: {
        phone,
        codeHash: this.hash(phone, code),
        expiresAt: new Date(Date.now() + this.ttlMs),
      },
    });

    const sentWith =
      this.exposeCode && this.reviewPhones.has(phone) ? 'console' : await this.deliver(phone, code);
    return sentWith === 'console' && this.exposeCode ? { devCode: code } : {};
  }

  /** Consumes the latest valid code for the phone; throws on mismatch or expiry. */
  async verify(phone: string, code: string): Promise<void> {
    const otp = await this.prisma.otpCode.findFirst({
      where: { phone, consumedAt: null, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: 'desc' },
    });
    if (!otp || otp.attempts >= MAX_ATTEMPTS) {
      throw new UnauthorizedException('Code expired. Request a new one.');
    }

    const expected = Buffer.from(otp.codeHash, 'hex');
    const actual = Buffer.from(this.hash(phone, code), 'hex');
    if (!timingSafeEqual(expected, actual)) {
      await this.prisma.otpCode.update({
        where: { id: otp.id },
        data: { attempts: { increment: 1 } },
      });
      throw new UnauthorizedException('Incorrect code');
    }

    await this.prisma.otpCode.update({ where: { id: otp.id }, data: { consumedAt: new Date() } });
  }

  private hash(phone: string, code: string): string {
    return createHmac('sha256', this.secret).update(`${phone}:${code}`).digest('hex');
  }

  /** Tries each configured sender in order (e.g. WhatsApp, then SMS). */
  private async deliver(phone: string, code: string): Promise<string> {
    for (const sender of this.senders) {
      try {
        await sender.send(phone, code);
        return sender.name;
      } catch (err) {
        this.logger.error(`OTP via ${sender.name} failed: ${(err as Error).message}`);
      }
    }
    throw new HttpException('Could not send the code. Try again.', HttpStatus.BAD_GATEWAY);
  }
}
