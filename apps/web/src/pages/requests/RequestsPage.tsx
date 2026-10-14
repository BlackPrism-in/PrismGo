import { Link } from 'react-router';
import { RequestList } from '../../components/RequestList';
import { PageHeader } from '../../components/ui';
import { useRequests } from '../../lib/queries';

const ACTIVE = new Set(['draft', 'pending_approval', 'approved', 'assigned', 'in_progress']);

export function RequestsPage() {
  const { data, error } = useRequests('scope=mine');
  // Upcoming soonest first; past newest first (the API order).
  const active = data
    ?.filter((r) => ACTIVE.has(r.status))
    .sort((a, b) => Date.parse(a.startAt) - Date.parse(b.startAt));
  const past = data?.filter((r) => !ACTIVE.has(r.status));

  return (
    <>
      <PageHeader
        title="My requests"
        description="Vehicle requests you have raised."
        action={
          <Link
            to="/requests/new"
            className="rounded-lg bg-coral-500 px-4 py-2 text-sm font-medium text-ink hover:bg-coral-600"
          >
            New request
          </Link>
        }
      />
      {error && (
        <p role="alert" className="text-sm text-red-700">
          {(error as Error).message}
        </p>
      )}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-sand-600">Upcoming and in progress</h2>
        <RequestList
          requests={active}
          empty="No upcoming trips. Raise a request to book a vehicle."
        />
      </section>
      {past && past.length > 0 && (
        <section className="mt-8 space-y-3">
          <h2 className="text-sm font-semibold text-sand-600">Past</h2>
          <RequestList requests={past} empty="" />
        </section>
      )}
    </>
  );
}
