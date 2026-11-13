import type { Role } from '@prismgo/shared';
import { createContext, useContext } from 'react';
import type { Me, RequestOtpResponse } from '../lib/types';

export type AuthState =
  | { status: 'loading' }
  | { status: 'anonymous' }
  /** The API couldn't be reached while restoring the session; the user stays signed in. */
  | { status: 'unreachable' }
  | { status: 'authenticated'; user: Me };

export interface AuthContextValue {
  state: AuthState;
  requestCode: (phone: string) => Promise<RequestOtpResponse>;
  verifyCode: (phone: string, code: string) => Promise<void>;
  logout: () => Promise<void>;
  /** First-login details; swaps in fresh tokens because the department is in them. */
  saveProfile: (body: { name: string; departmentId?: string; email?: string }) => Promise<void>;
  /** Tries to restore the session again after the API was unreachable. */
  retry: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

/** The signed-in user. Only call below <RequireAuth>. */
export function useMe(): Me {
  const { state } = useAuth();
  if (state.status !== 'authenticated') throw new Error('useMe called without a session');
  return state.user;
}

const STAFF_ROLES: Role[] = ['hod', 'transport_manager', 'super_admin'];

/** New self-signed-up requesters must give their name and department before using the app. */
export function needsProfile(user: Pick<Me, 'name' | 'roles' | 'department'>): boolean {
  if (!user.name.trim()) return true;
  return user.department === null && !user.roles.some((r) => STAFF_ROLES.includes(r));
}

export function hasRole(user: Pick<Me, 'roles'>, ...roles: Role[]): boolean {
  return user.roles.some((r) => roles.includes(r));
}

export const ROLE_LABELS: Record<Role, string> = {
  requester: 'Requester',
  hod: 'HOD',
  transport_manager: 'Transport Manager',
  super_admin: 'Super Admin',
};

export const MASTER_DATA_ROLES: Role[] = ['super_admin', 'transport_manager'];
