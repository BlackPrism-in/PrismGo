import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { normalizeIndianMobile } from '@prismgo/shared';
import { PrismaService } from '../prisma/prisma.service';
import type { MeDto, UpdateProfileDto } from './auth.dto';
import { OtpService } from './otp/otp.service';
import { openSignup, signupOrgId } from './signup-org';
import { TokensService, type TokenPair } from './tokens.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly otp: OtpService,
    private readonly tokens: TokensService,
    private readonly config: ConfigService,
  ) {}

  /**
   * With open sign-up (the default) any number gets a code: the first login creates a
   * requester account. Deactivated users get nothing, but the answer is the same.
   */
  async requestOtp(rawPhone: string): Promise<{ sent: true; devCode?: string }> {
    const phone = this.normalize(rawPhone);
    const user = await this.prisma.user.findUnique({ where: { phone } });
    if (!this.mayLogIn(user)) return { sent: true };
    const { devCode } = await this.otp.issue(phone);
    return devCode ? { sent: true, devCode } : { sent: true };
  }

  async verifyOtp(
    rawPhone: string,
    code: string,
    userAgent?: string,
  ): Promise<TokenPair & { user: MeDto }> {
    const phone = this.normalize(rawPhone);
    const existing = await this.prisma.user.findUnique({ where: { phone } });
    if (!this.mayLogIn(existing)) throw new UnauthorizedException('Incorrect code');

    await this.otp.verify(phone, code);
    const user = existing
      ? await this.prisma.user.update({
          where: { id: existing.id },
          // A pending access request is let in by logging in.
          data: { lastLoginAt: new Date(), status: 'active' },
        })
      : await this.createRequester(phone);
    const pair = await this.tokens.issue(user, userAgent);
    return { ...pair, user: await this.me(user.id) };
  }

  /**
   * First-login details: name, and department while the user has none (it decides
   * which HOD approves their trips; after that only an admin can change it).
   */
  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
    let departmentId: string | undefined;
    if (dto.departmentId && dto.departmentId !== user.departmentId) {
      if (user.departmentId) {
        throw new BadRequestException('Ask your admin to change your department');
      }
      const dept = await this.prisma.department.findFirst({
        where: { id: dto.departmentId, orgId: user.orgId },
      });
      if (!dept) throw new BadRequestException('Department not found');
      departmentId = dept.id;
    }
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        name: dto.name.trim(),
        departmentId,
        email: dto.email === undefined ? undefined : dto.email.trim() || null,
      },
    });
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

  private mayLogIn(user: { status: string } | null): boolean {
    if (!user) return openSignup(this.config);
    return user.status === 'active' || (user.status === 'pending' && openSignup(this.config));
  }

  /** Name and department are asked for on the next screen. */
  private async createRequester(phone: string) {
    const orgId = await signupOrgId(this.prisma, this.config);
    try {
      return await this.prisma.user.create({
        data: { orgId, name: '', phone, roles: ['requester'], lastLoginAt: new Date() },
      });
    } catch {
      // Two logins for the same new number at once: use the one that won.
      return this.prisma.user.findUniqueOrThrow({ where: { phone } });
    }
  }

  private normalize(raw: string): string {
    const phone = normalizeIndianMobile(raw);
    if (!phone) throw new BadRequestException('Enter a valid 10-digit mobile number');
    return phone;
  }
}
