import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { ApiError, get, onSessionExpiry, post, refreshSession, setAccessToken } from '../lib/api';
import type { AuthResponse, Me, RequestOtpResponse } from '../lib/types';
import { AuthContext, type AuthState } from './auth-context';

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [state, setState] = useState<AuthState>({ status: 'loading' });

  const signOutLocally = useCallback(() => {
    setAccessToken(null);
    queryClient.clear();
    setState({ status: 'anonymous' });
  }, [queryClient]);

  const [attempt, setAttempt] = useState(0);
  const retry = useCallback(() => {
    setState({ status: 'loading' });
    setAttempt((n) => n + 1);
  }, []);

  // Restore the session from the refresh cookie on first load (and on retry).
  useEffect(() => {
    onSessionExpiry(signOutLocally);
    let cancelled = false;
    const settle = (next: AuthState) => !cancelled && setState(next);
    void (async () => {
      const refreshed = await refreshSession();
      if (refreshed === 'expired') return settle({ status: 'anonymous' });
      if (refreshed === 'unavailable') return settle({ status: 'unreachable' });
      try {
        settle({ status: 'authenticated', user: await get<Me>('/auth/me') });
      } catch (err) {
        settle(
          err instanceof ApiError && err.status === 401
            ? { status: 'anonymous' }
            : { status: 'unreachable' },
        );
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [signOutLocally, attempt]);

  const requestCode = useCallback(
    (phone: string) => post<RequestOtpResponse>('/auth/otp/request', { phone }),
    [],
  );

  const verifyCode = useCallback(async (phone: string, code: string) => {
    const res = await post<AuthResponse>('/auth/otp/verify', { phone, code });
    setAccessToken(res.accessToken);
    setState({ status: 'authenticated', user: res.user });
  }, []);

  const logout = useCallback(async () => {
    try {
      await post('/auth/logout');
    } finally {
      signOutLocally();
    }
  }, [signOutLocally]);

  const value = useMemo(
    () => ({ state, requestCode, verifyCode, logout, retry }),
    [state, requestCode, verifyCode, logout, retry],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
