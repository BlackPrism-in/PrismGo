import type { ConfigService } from '@nestjs/config';
import { describe, expect, it } from 'vitest';
import type { PrismaService } from '../../prisma/prisma.service';
import type { OtpSender } from './otp-sender';
import { OtpService } from './otp.service';

const REVIEWER = '+919000000099';

function service(env: Record<string, string>) {
  const sent: string[] = [];
  const whatsapp: OtpSender = {
    name: 'whatsapp',
    send: async (phone) => {
      sent.push(phone);
    },
  };
  const prisma = {
    otpCode: { count: async () => 0, create: async () => ({}) },
  } as unknown as PrismaService;
  const config = {
    get: (key: string) => env[key],
    getOrThrow: () => 'test-secret',
  } as unknown as ConfigService;
  return { otp: new OtpService(prisma, config, [whatsapp]), sent };
}

const staging = {
  NODE_ENV: 'production',
  OTP_EXPOSE_CODE: 'true',
  OTP_REVIEW_PHONES: `${REVIEWER}, +919000000098`,
};

describe('OTP review phones', () => {
  it('shows the code on screen for a review phone instead of sending it', async () => {
    const { otp, sent } = service(staging);
    const { devCode } = await otp.issue(REVIEWER);
    expect(devCode).toMatch(/^\d{6}$/);
    expect(sent).toEqual([]);
  });

  it('sends other numbers as usual', async () => {
    const { otp, sent } = service(staging);
    expect(await otp.issue('+919812345678')).toEqual({});
    expect(sent).toEqual(['+919812345678']);
  });

  it('has no effect where codes must not be exposed (production)', async () => {
    const { otp, sent } = service({ ...staging, OTP_EXPOSE_CODE: 'false' });
    expect(await otp.issue(REVIEWER)).toEqual({});
    expect(sent).toEqual([REVIEWER]);
  });
});
