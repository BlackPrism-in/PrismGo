import { formatIndianMobile } from '@prismgo/shared';
import { useAccessDecision, useAccessRequests } from '../lib/queries';
import { Button, ErrorBanner } from './ui';

/**
 * New employees who asked for access from the login screen. Approving lets them log in
 * as a requester in the department they chose; declining removes the request.
 * Hidden when nothing is waiting.
 */
export function AccessRequests() {
  const { data } = useAccessRequests();
  const decide = useAccessDecision();
  if (!data?.length) return null;

  return (
    <section className="mb-8 space-y-3">
      <h2 className="text-sm font-semibold text-sand-600">
        New people asking for access ({data.length})
      </h2>
      <ErrorBanner error={decide.error} />
      <ul className="divide-y divide-sand-200 rounded-xl border border-sand-200 bg-white">
        {data.map((r) => {
          const busy = decide.isPending && decide.variables?.id === r.id;
          return (
            <li
              key={r.id}
              className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <div className="font-medium">{r.name}</div>
                <div className="text-sm text-sand-600">
                  {formatIndianMobile(r.phone)} · {r.department?.name ?? 'No department'}
                  {r.email ? ` · ${r.email}` : ''}
                </div>
                <div className="text-xs text-sand-500">
                  Asked{' '}
                  {new Date(r.requestedAt).toLocaleString('en-IN', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  disabled={busy}
                  onClick={() => decide.mutate({ id: r.id, decision: 'approve' })}
                >
                  Approve
                </Button>
                <Button
                  variant="secondary"
                  disabled={busy}
                  onClick={() => {
                    if (confirm(`Decline ${r.name}'s request?`)) {
                      decide.mutate({ id: r.id, decision: 'reject' });
                    }
                  }}
                >
                  Decline
                </Button>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
