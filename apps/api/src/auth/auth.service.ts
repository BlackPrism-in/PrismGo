import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { normalizeIndianMobile } from '@prismgo/shared';
import { PrismaService } from '../prisma/prisma.service';
import type { MeDto } from './auth.dto';
import { OtpService } from './otp/otp.service';
import { TokensService, type TokenPair } from './tokens.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly otp: OtpService,
    private readonly tokens: TokensService,
  ) {}

  /**
   * Sends a code only to active registered users, but always answers the same way
   * so the endpoint can't be used to discover which numbers are registered.
   */
  async requestOtp(rawPhone: string): Promise<{ sent: true; devCode?: string }> {
    const phone = this.normalize(rawPhone);
    const user = await this.prisma.user.findUnique({ where: { phone } });
    if (!user || user.status !== 'active') return { sent: true };
    const { devCode } = await this.otp.issue(phone);
    return devCode ? { sent: true, devCode } : { sent: true };
  }

  async verifyOtp(
    rawPhone: string,
    code: string,
    userAgent?: string,
  ): Promise<TokenPair & { user: MeDto }> {
    const phone = this.normalize(rawPhone);
    const user = await this.prisma.user.findUnique({ where: { phone } });
    if (!user || user.status !== 'active') throw new UnauthorizedException('Incorrect code');

    await this.otp.verify(phone, code);
    await this.prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
    const pair = await this.tokens.issue(user, userAgent);
    return { ...pair, user: await this.me(user.id) };
  }

  async me(userId: string): Promise<MeDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { department: true, org: true },
    });
    if (!user) throw new NotFoundException();
    return {
      id: user.id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      roles: user.roles,
      department: user.department ? { id: user.department.id, name: user.department.name } : null,
      orgId: user.orgId,
      orgName: user.org.name,
    };
  }

  private normalize(raw: string): string {
    const phone = normalizeIndianMobile(raw);
    if (!phone) throw new BadRequestException('Enter a valid 10-digit mobile number');
    return phone;
  }
}
