/**
 * PrismGo API client for the browser.
 * - Access token lives only in memory.
 * - Refresh token is an httpOnly cookie set by the API (we send `X-Client: web`).
 * - A 401 triggers one shared refresh, then the request is retried once.
 * - Same origin by default; VITE_API_ORIGIN points at an API on another host
 *   (e.g. web on Vercel, API on Render). Both must share a site for the cookie.
 */
export const API_ORIGIN = (import.meta.env['VITE_API_ORIGIN'] as string | undefined) ?? '';
export const API_BASE = `${API_ORIGIN}/api/v1`;

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

/** Calls that must not trigger a refresh-and-retry on 401. */
const NO_RETRY = ['/auth/otp/', '/auth/refresh', '/auth/logout'];

let accessToken: string | null = null;
let refreshing: Promise<RefreshResult> | null = null;
let onSessionExpired: (() => void) | null = null;

export function getAccessToken(): string | null {
  return accessToken;
}

export function setAccessToken(token: string | null): void {
  accessToken = token;
}

export function onSessionExpiry(handler: () => void): void {
  onSessionExpired = handler;
}

async function send(method: string, path: string, body?: unknown): Promise<Response> {
  const headers: Record<string, string> = { Accept: 'application/json', 'X-Client': 'web' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;
  return fetch(`${API_BASE}${path}`, {
    method,
    headers,
    credentials: 'include',
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

export type RefreshResult = 'ok' | 'expired' | 'unavailable';

/**
 * Uses the refresh cookie to get a new access token. Concurrent callers share one call.
 * 'expired' means the server rejected the session; 'unavailable' means we couldn't
 * reach it (network down, API restarting), which must not log the user out.
 */
export function refreshSession(): Promise<RefreshResult> {
  refreshing ??= (async (): Promise<RefreshResult> => {
    try {
      const res = await send('POST', '/auth/refresh', {});
      if (res.status === 401 || res.status === 403) return 'expired';
      if (!res.ok) return 'unavailable';
      const data = (await res.json()) as { accessToken: string };
      accessToken = data.accessToken;
      return 'ok';
    } catch {
      return 'unavailable';
    } finally {
      refreshing = null;
    }
  })();
  return refreshing;
}

const UNREACHABLE = "Can't reach PrismGo. Check your connection and try again.";

async function errorFrom(res: Response): Promise<ApiError> {
  const data = (await res.json().catch(() => null)) as { message?: string | string[] } | null;
  const message = Array.isArray(data?.message)
    ? data.message.join('. ')
    : (data?.message ?? `Request failed (${res.status})`);
  return new ApiError(res.status, message);
}

export async function api<T>(method: string, path: string, body?: unknown): Promise<T> {
  let res: Response;
  try {
    res = await send(method, path, body);
    if (res.status === 401 && !NO_RETRY.some((p) => path.startsWith(p))) {
      const refreshed = await refreshSession();
      if (refreshed === 'ok') {
        res = await send(method, path, body);
      } else if (refreshed === 'expired') {
        accessToken = null;
        onSessionExpired?.();
      } else {
        throw new ApiError(503, UNREACHABLE);
      }
    }
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(0, UNREACHABLE);
  }
  if (res.status === 502 || res.status === 503 || res.status === 504) {
    throw new ApiError(res.status, UNREACHABLE);
  }
  if (!res.ok) throw await errorFrom(res);
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const get = <T>(path: string) => api<T>('GET', path);
export const post = <T>(path: string, body?: unknown) => api<T>('POST', path, body ?? {});
export const patch = <T>(path: string, body: unknown) => api<T>('PATCH', path, body);

export interface Health {
  status: 'ok' | 'degraded';
  db: 'up' | 'down';
  redis: 'up' | 'down';
}

/** Health returns 503 with a body when degraded, so read it either way. */
export async function getHealth(): Promise<Health> {
  const res = await fetch(`${API_BASE}/health`, { headers: { Accept: 'application/json' } });
  const body = (await res.json().catch(() => null)) as Health | null;
  if (!body) throw new ApiError(res.status, 'API unreachable');
  return body;
}
