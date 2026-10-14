import type { Role } from '@prismgo/shared';

/** The authenticated user attached to each request by JwtAuthGuard. */
export interface AuthUser {
  id: string;
  orgId: string;
  roles: Role[];
  departmentId: string | null;
}

export interface AccessTokenPayload {
  sub: string;
  org: string;
  roles: Role[];
  dept: string | null;
}
