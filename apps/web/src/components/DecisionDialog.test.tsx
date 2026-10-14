import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import type { TripRequest } from '../lib/types';
import { DecisionDialog, type Decision } from './DecisionDialog';

// jsdom has no <dialog> modal support.
HTMLDialogElement.prototype.showModal ??= function (this: HTMLDialogElement) {
  this.open = true;
};
HTMLDialogElement.prototype.close ??= function (this: HTMLDialogElement) {
  this.open = false;
};

const request = {
  id: 'r1',
  code: 'PG-1001',
  requester: { id: 'u1', name: 'Rahul', phone: '+919000000005' },
  pickup: { address: 'Office', lat: 1, lng: 1 },
  drop: { address: 'Airport', lat: 2, lng: 2 },
} as TripRequest;

function renderDialog(decision: Decision) {
  const fetchMock = vi
    .fn()
    .mockResolvedValue(
      new Response(JSON.stringify({ ...request, status: 'rejected' }), { status: 200 }),
    );
  vi.stubGlobal('fetch', fetchMock);
  render(
    <QueryClientProvider client={new QueryClient()}>
      <DecisionDialog request={request} decision={decision} onClose={() => {}} />
    </QueryClientProvider>,
  );
  return fetchMock;
}

afterEach(() => vi.unstubAllGlobals());

it('needs a reason before declining', async () => {
  const fetchMock = renderDialog('reject');
  const button = screen.getByRole('button', { name: 'Decline' });
  expect(button).toBeDisabled();

  fireEvent.change(screen.getByLabelText('Reason'), { target: { value: 'Use the shuttle' } });
  expect(button).toBeEnabled();
  fireEvent.click(button);

  await waitFor(() => expect(fetchMock).toHaveBeenCalledOnce());
  const [url, init] = fetchMock.mock.calls[0]!;
  expect(url).toBe('/api/v1/requests/r1/reject');
  expect(JSON.parse(init.body)).toEqual({ comment: 'Use the shuttle' });
});

it('approves without a comment', async () => {
  const fetchMock = renderDialog('approve');
  fireEvent.click(screen.getByRole('button', { name: 'Approve' }));
  await waitFor(() => expect(fetchMock).toHaveBeenCalledOnce());
  expect(JSON.parse(fetchMock.mock.calls[0]![1].body)).toEqual({});
});

it('sends a cancellation reason as "reason"', async () => {
  const fetchMock = renderDialog('cancel');
  fireEvent.change(screen.getByLabelText('Reason'), { target: { value: 'Meeting moved' } });
  fireEvent.click(screen.getByRole('button', { name: 'Cancel trip' }));
  await waitFor(() => expect(fetchMock).toHaveBeenCalledOnce());
  expect(fetchMock.mock.calls[0]![0]).toBe('/api/v1/requests/r1/cancel');
  expect(JSON.parse(fetchMock.mock.calls[0]![1].body)).toEqual({ reason: 'Meeting moved' });
});
