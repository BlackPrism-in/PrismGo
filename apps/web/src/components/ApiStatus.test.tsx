import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { afterEach, vi } from 'vitest';
import { ApiStatus } from './ApiStatus';

function renderWithQuery() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <ApiStatus />
    </QueryClientProvider>,
  );
}

afterEach(() => vi.unstubAllGlobals());

it('shows online when the API is healthy', async () => {
  vi.stubGlobal(
    'fetch',
    vi
      .fn()
      .mockResolvedValue(
        new Response(JSON.stringify({ status: 'ok', db: 'up', redis: 'up' }), { status: 200 }),
      ),
  );
  renderWithQuery();
  expect(await screen.findByText('API online')).toBeInTheDocument();
});

it('names the failing dependency when degraded', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ status: 'degraded', db: 'up', redis: 'down' }), {
        status: 503,
      }),
    ),
  );
  renderWithQuery();
  expect(await screen.findByText('API degraded (db up, redis down)')).toBeInTheDocument();
});
