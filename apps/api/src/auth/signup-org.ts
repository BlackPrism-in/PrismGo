import { NotFoundException } from '@nestjs/common';
import type { ConfigService } from '@nestjs/config';
import type { PrismaService } from '../prisma/prisma.service';

/** The organisation new self-service users join: SIGNUP_ORG_ID, or the only one there is. */
export async function signupOrgId(prisma: PrismaService, config: ConfigService): Promise<string> {
  const configured = config.get<string>('SIGNUP_ORG_ID');
  if (configured) return configured;
  const orgs = await prisma.organisation.findMany({ select: { id: true }, take: 2 });
  if (orgs.length !== 1) throw new NotFoundException('Sign-up is not available');
  return orgs[0]!.id;
}

/** OPEN_SIGNUP=false turns off first-login sign-up; then only users added by an admin can log in. */
export function openSignup(config: ConfigService): boolean {
  return config.get<string>('OPEN_SIGNUP') !== 'false';
}
