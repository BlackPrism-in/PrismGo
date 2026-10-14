import type { Role } from '@prismgo/shared';
import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router';
import { Button } from '../components/ui';
import { hasRole, useAuth } from './auth-context';

export function FullPageSpinner() {
  return (
    <div className="flex min-h-screen items-center justify-center text-sm text-sand-500">
      Loading…
    </div>
  );
}

export function Unreachable({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-sm text-sand-600">
        Can't reach PrismGo right now. You're still signed in.
      </p>
      <Button onClick={onRetry}>Try again</Button>
    </div>
  );
}

export function RequireAuth({ children }: { children: ReactNode }) {
  const { state, retry } = useAuth();
  const location = useLocation();
  if (state.status === 'loading') return <FullPageSpinner />;
  if (state.status === 'unreachable') return <Unreachable onRetry={retry} />;
  if (state.status === 'anonymous') {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return children;
}

export function RequireRole({ roles, children }: { roles: Role[]; children: ReactNode }) {
  const { state } = useAuth();
  if (state.status !== 'authenticated') return null;
  if (!hasRole(state.user, ...roles)) return <Navigate to="/" replace />;
  return children;
}
