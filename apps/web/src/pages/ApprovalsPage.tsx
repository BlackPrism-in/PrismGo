import { useState } from 'react';
import { DecisionDialog, type Decision } from '../components/DecisionDialog';
import { RequestList } from '../components/RequestList';
import { Button, PageHeader } from '../components/ui';
import { useRequests } from '../lib/queries';
import type { TripRequest } from '../lib/types';

export function ApprovalsPage() {
  const pending = useRequests('scope=approvals&status=pending_approval');
  const all = useRequests('scope=approvals');
  const decided = all.data?.filter((r) => r.status !== 'pending_approval').slice(0, 20);
  const [target, setTarget] = useState<{ request: TripRequest; decision: Decision } | null>(null);

  return (
    <>
      <PageHeader title="Approvals" description="Vehicle requests from your department." />
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-sand-600">
          Waiting for you {pending.data ? `(${pending.data.length})` : ''}
        </h2>
        <RequestList
          requests={pending.data}
          showRequester
          empty="You're all caught up."
          extra={(r) => (
            <div className="flex gap-2">
              <Button onClick={() => setTarget({ request: r, decision: 'approve' })}>
                Approve
              </Button>
              <Button
                variant="secondary"
                onClick={() => setTarget({ request: r, decision: 'reject' })}
              >
                Decline
              </Button>
            </div>
          )}
        />
      </section>
      <section className="mt-8 space-y-3">
        <h2 className="text-sm font-semibold text-sand-600">Recent</h2>
        <RequestList requests={decided} showRequester empty="No decisions yet." />
      </section>
      <DecisionDialog
        request={target?.request ?? null}
        decision={target?.decision ?? 'approve'}
        onClose={() => setTarget(null)}
      />
    </>
  );
}
