import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { Role } from '@prismgo/shared';
import { createHash, randomBytes } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service';
import type { AccessTokenPayload } from './auth.types';

export const ACCESS_TOKEN_TTL_S = 15 * 60;
const REFRESH_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

interface TokenUser {
  id: string;
  orgId: string;
  roles: Role[];
  departmentId: string | null;
}

@Injectable()
export class TokensService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async issue(user: TokenUser, userAgent?: string): Promise<TokenPair> {
    const refreshToken = randomBytes(32).toString('base64url');
    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: this.hash(refreshToken),
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
        userAgent: userAgent?.slice(0, 255),
      },
    });
    return {
      accessToken: await this.signAccess(user),
      refreshToken,
      expiresIn: ACCESS_TOKEN_TTL_S,
    };
  }

  /**
   * Rotates a refresh token. Presenting an already-rotated token means it leaked,
   * so every session for that user is revoked.
   */
  async rotate(refreshToken: string, userAgent?: string): Promise<TokenPair> {
    const stored = await this.prisma.refreshToken.findUnique({
      where: { tokenHash: this.hash(refreshToken) },
      include: { user: true },
    });
    if (!stored || stored.expiresAt < new Date() || stored.user.status !== 'active') {
      throw new UnauthorizedException('Session expired. Log in again.');
    }
    if (stored.revokedAt) {
      await this.revokeAll(stored.userId);
      throw new UnauthorizedException('Session expired. Log in again.');
    }

    const next = await this.issue(stored.user, userAgent);
    const nextRow = await this.prisma.refreshToken.findUniqueOrThrow({
      where: { tokenHash: this.hash(next.refreshToken) },
    });
    await this.prisma.refreshToken.update({
      where: { id: stored.id },
      data: { revokedAt: new Date(), replacedById: nextRow.id },
    });
    return next;
  }

  async revoke(refreshToken: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { tokenHash: this.hash(refreshToken), revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  async revokeAll(userId: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  private signAccess(user: TokenUser): Promise<string> {
    const payload: AccessTokenPayload = {
      sub: user.id,
      org: user.orgId,
      roles: user.roles,
      dept: user.departmentId,
    };
    return this.jwt.signAsync(payload, {
      secret: this.config.getOrThrow<string>('JWT_ACCESS_SECRET'),
      expiresIn: ACCESS_TOKEN_TTL_S,
    });
  }

  private hash(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }
}
