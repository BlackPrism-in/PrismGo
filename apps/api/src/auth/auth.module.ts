import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { isLiveProduction } from '../config/env';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ConsoleOtpSender } from './otp/console-otp.sender';
import { OTP_SENDERS, type OtpSender } from './otp/otp-sender';
import { OtpService } from './otp/otp.service';
import { WhatsAppOtpSender } from './otp/whatsapp-otp.sender';
import { RolesGuard } from './roles.guard';
import { TokensService } from './tokens.service';

/**
 * OTP_CHANNELS sets delivery order, e.g. "whatsapp,console" (console: dev and
 * staging only). Login codes go by WhatsApp; there is no SMS channel.
 */
function buildSenders(config: ConfigService): OtpSender[] {
  const channels = (config.get<string>('OTP_CHANNELS') ?? 'console')
    .split(',')
    .map((c) => c.trim())
    .filter(Boolean);
  const senders: OtpSender[] = [];
  for (const channel of channels) {
    if (channel === 'whatsapp') {
      senders.push(
        new WhatsAppOtpSender(
          config.getOrThrow('WHATSAPP_PHONE_NUMBER_ID'),
          config.getOrThrow('WHATSAPP_ACCESS_TOKEN'),
          config.get('WHATSAPP_OTP_TEMPLATE') ?? 'login_code',
        ),
      );
    } else if (channel === 'console') {
      if (isLiveProduction((k) => config.get(k))) {
        throw new Error(
          'OTP_CHANNELS must not include "console" in production (use APP_ENV=staging for UAT)',
        );
      }
      senders.push(new ConsoleOtpSender());
    } else {
      throw new Error(`Unknown OTP channel "${channel}"`);
    }
  }
  if (senders.length === 0) throw new Error('OTP_CHANNELS is empty');
  return senders;
}

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_ACCESS_SECRET'),
      }),
    }),
  ],
  controllers: [AuthController],
  exports: [TokensService, JwtModule],
  providers: [
    AuthService,
    OtpService,
    TokensService,
    { provide: OTP_SENDERS, inject: [ConfigService], useFactory: buildSenders },
    // Order matters: authenticate first, then check roles.
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AuthModule {}
