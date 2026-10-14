import { useState } from 'react';
import { AssignDialog } from '../components/AssignDialog';
import { RequestList } from '../components/RequestList';
import { Button, PageHeader } from '../components/ui';
import { useRequests } from '../lib/queries';
import type { TripRequest } from '../lib/types';

export function DispatchPage() {
  const toAssign = useRequests('scope=all&status=approved');
  const upcoming = useRequests('scope=all&status=assigned');
  const waiting = useRequests('scope=all&status=pending_approval');
  const onTheWay = useRequests('scope=all&status=in_progress');
  const [assigning, setAssigning] = useState<TripRequest | null>(null);

  return (
    <>
      <PageHeader
        title="Dispatch"
        description="Assign vehicles and drivers to approved requests."
      />
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-sand-600">
          To assign {toAssign.data ? `(${toAssign.data.length})` : ''}
        </h2>
        <RequestList
          requests={toAssign.data}
          showRequester
          empty="Nothing waiting for a vehicle."
          extra={(r) => <Button onClick={() => setAssigning(r)}>Assign</Button>}
        />
      </section>
      <section className="mt-8 space-y-3">
        <h2 className="text-sm font-semibold text-sand-600">
          On the way {onTheWay.data ? `(${onTheWay.data.length})` : ''}
        </h2>
        <RequestList requests={onTheWay.data} showRequester empty="No trips in progress." />
      </section>
      <section className="mt-8 space-y-3">
        <h2 className="text-sm font-semibold text-sand-600">Assigned, not started</h2>
        <RequestList
          requests={upcoming.data}
          showRequester
          empty="No upcoming trips."
          extra={(r) =>
            r.actions.includes('reassign') ? (
              <Button variant="secondary" onClick={() => setAssigning(r)}>
                Change
              </Button>
            ) : null
          }
        />
      </section>
      <section className="mt-8 space-y-3">
        <h2 className="text-sm font-semibold text-sand-600">Waiting for HOD approval</h2>
        <RequestList requests={waiting.data} showRequester empty="None." />
      </section>
      <AssignDialog request={assigning} onClose={() => setAssigning(null)} />
    </>
  );
}
