import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { api, ApiError, onSessionExpiry, setAccessToken } from './api';

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  fetchMock = vi.fn();
  vi.stubGlobal('fetch', fetchMock);
  setAccessToken('old-token');
});

afterEach(() => vi.unstubAllGlobals());

it('refreshes once on 401 and retries with the new token', async () => {
  fetchMock
    .mockResolvedValueOnce(json(401, { message: 'Unauthorized' }))
    .mockResolvedValueOnce(json(200, { accessToken: 'new-token', expiresIn: 900 }))
    .mockResolvedValueOnce(json(200, [{ id: 'v1' }]));

  await expect(api('GET', '/vehicles')).resolves.toEqual([{ id: 'v1' }]);

  const [, refreshCall, retryCall] = fetchMock.mock.calls;
  expect(refreshCall![0]).toBe('/api/v1/auth/refresh');
  expect(retryCall![1].headers.Authorization).toBe('Bearer new-token');
});

it('signals session expiry when the refresh fails', async () => {
  const expired = vi.fn();
  onSessionExpiry(expired);
  fetchMock
    .mockResolvedValueOnce(json(401, {}))
    .mockResolvedValueOnce(json(401, { message: 'Session expired' }));

  await expect(api('GET', '/vehicles')).rejects.toBeInstanceOf(ApiError);
  expect(expired).toHaveBeenCalledOnce();
});

it('surfaces validation messages from the API', async () => {
  fetchMock.mockResolvedValueOnce(
    json(400, { message: ['seats must not be less than 1', 'type should not be empty'] }),
  );
  await expect(api('POST', '/vehicles', {})).rejects.toThrow(
    'seats must not be less than 1. type should not be empty',
  );
});

it('does not try to refresh when the login call itself is rejected', async () => {
  fetchMock.mockResolvedValueOnce(json(401, { message: 'Incorrect code' }));
  await expect(api('POST', '/auth/otp/verify', {})).rejects.toThrow('Incorrect code');
  expect(fetchMock).toHaveBeenCalledTimes(1);
});

it('keeps the session when the API is unreachable during refresh', async () => {
  const expired = vi.fn();
  onSessionExpiry(expired);
  fetchMock
    .mockResolvedValueOnce(json(401, {}))
    .mockResolvedValueOnce(new Response('Bad Gateway', { status: 502 }));

  await expect(api('GET', '/vehicles')).rejects.toThrow("Can't reach PrismGo");
  expect(expired).not.toHaveBeenCalled();
});

it('reports a network failure as unreachable', async () => {
  fetchMock.mockRejectedValueOnce(new TypeError('Failed to fetch'));
  await expect(api('GET', '/vehicles')).rejects.toThrow("Can't reach PrismGo");
});
