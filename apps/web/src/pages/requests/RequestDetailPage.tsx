import { formatIndianMobile } from '@prismgo/shared';
import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { AssignDialog } from '../../components/AssignDialog';
import { DecisionDialog, type Decision } from '../../components/DecisionDialog';
import { RequestStatusBadge } from '../../components/RequestStatusBadge';
import { TripMap } from '../../components/map/TripMap';
import { Timeline } from '../../components/Timeline';
import { Button, ErrorBanner } from '../../components/ui';
import { formatDateTime, formatTime } from '../../lib/format';
import { useRequest, useRequestAction } from '../../lib/queries';

export function RequestDetailPage() {
  const { id = '' } = useParams();
  const { data: r, error, isLoading } = useRequest(id);
  const submit = useRequestAction();
  const [decision, setDecision] = useState<Decision | null>(null);
  const [assigning, setAssigning] = useState(false);

  if (isLoading) return <p className="text-sm text-sand-500">Loading…</p>;
  if (!r) return <ErrorBanner error={error ?? new Error('Request not found')} />;
  const can = (a: string) => r.actions.includes(a);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold">{r.code}</h1>
            <RequestStatusBadge status={r.status} />
          </div>
          <p className="mt-1 text-sm text-sand-600">
            {r.requester.name} · {r.department.name}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {can('approve') && <Button onClick={() => setDecision('approve')}>Approve</Button>}
          {can('reject') && (
            <Button variant="secondary" onClick={() => setDecision('reject')}>
              Decline
            </Button>
          )}
          {can('assign') && <Button onClick={() => setAssigning(true)}>Assign vehicle</Button>}
          {can('reassign') && (
            <Button variant="secondary" onClick={() => setAssigning(true)}>
              Change vehicle or driver
            </Button>
          )}
          {can('submit') && (
            <Button
              disabled={submit.isPending}
              onClick={() => submit.mutate({ path: `/requests/${r.id}/submit` })}
            >
              Submit for approval
            </Button>
          )}
          {can('edit') && (
            <Link
              to={`/requests/${r.id}/edit`}
              className="rounded-lg border border-sand-300 bg-white px-4 py-2 text-sm font-medium text-sand-700 hover:bg-sand-50"
            >
              Edit
            </Link>
          )}
          {can('start') && (
            <Button
              variant="secondary"
              disabled={submit.isPending}
              onClick={() => submit.mutate({ path: `/trips/${r.trip!.id}/start` })}
            >
              Start trip now
            </Button>
          )}
          {can('end') && (
            <Button
              disabled={submit.isPending}
              onClick={() => submit.mutate({ path: `/trips/${r.trip!.id}/end` })}
            >
              End trip
            </Button>
          )}
          {can('cancel') && (
            <Button variant="ghost" onClick={() => setDecision('cancel')}>
              Cancel trip
            </Button>
          )}
        </div>
      </div>
      <ErrorBanner error={submit.error} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-xl border border-sand-200 bg-white p-5">
            <dl className="grid gap-4 sm:grid-cols-2">
              <Detail label="Pickup" value={r.pickup.address} />
              <Detail label="Drop" value={r.drop.address} />
              <Detail label="Pickup time" value={formatDateTime(r.startAt)} />
              <Detail label="Return" value={r.returnAt ? formatDateTime(r.returnAt) : 'One way'} />
              <Detail label="People" value={String(r.passengers)} />
              <Detail label="Purpose" value={r.purpose} />
              {r.notes && <Detail label="Notes" value={r.notes} />}
              {r.cancelReason && <Detail label="Cancellation reason" value={r.cancelReason} />}
            </dl>
          </section>

          {r.trip && (
            <section className="rounded-xl border border-sand-200 bg-white p-5">
              <h2 className="mb-3 font-semibold">Vehicle and driver</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg bg-mint-100 p-4">
                  <div className="font-mono text-lg font-semibold">{r.trip.vehicle.regNo}</div>
                  <div className="text-sm text-sand-700">
                    {r.trip.vehicle.type} · {r.trip.vehicle.seats} seats
                  </div>
                </div>
                <div className="rounded-lg bg-sand-50 p-4">
                  <div className="font-semibold">{r.trip.driver.name}</div>
                  <a
                    href={`tel:${r.trip.driver.phone}`}
                    className="text-sm text-coral-700 hover:underline"
                  >
                    {formatIndianMobile(r.trip.driver.phone)}
                  </a>
                </div>
              </div>
              <p className="mt-3 text-xs text-sand-500">
                Booked {formatDateTime(r.trip.scheduledStart)} – {formatTime(r.trip.scheduledEnd)}
              </p>
            </section>
          )}

          {r.trip && (
            <section className="rounded-xl border border-sand-200 bg-white p-5">
              <h2 className="mb-3 font-semibold">Map</h2>
              <TripMap tripId={r.trip.id} />
            </section>
          )}
        </div>

        <section className="rounded-xl border border-sand-200 bg-white p-5">
          <h2 className="mb-4 font-semibold">History</h2>
          <Timeline entries={r.timeline} />
        </section>
      </div>

      <DecisionDialog
        request={decision ? r : null}
        decision={decision ?? 'approve'}
        onClose={() => setDecision(null)}
      />
      <AssignDialog request={assigning ? r : null} onClose={() => setAssigning(false)} />
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium tracking-wide text-sand-500 uppercase">{label}</dt>
      <dd className="mt-1 text-sm">{value}</dd>
    </div>
  );
}
