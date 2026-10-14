import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { hasRole, MASTER_DATA_ROLES, useMe } from '../auth/auth-context';
import { RequestList } from '../components/RequestList';
import { PageHeader } from '../components/ui';
import { useRequests } from '../lib/queries';

export function DashboardPage() {
  const me = useMe();
  const isManager = hasRole(me, ...MASTER_DATA_ROLES);
  const isHod = hasRole(me, 'hod');
  const canRequest = hasRole(me, 'requester', 'hod');

  return (
    <>
      <PageHeader
        title={`Hello, ${me.name.split(' ')[0]}`}
        description={`${me.orgName}${me.department ? ` · ${me.department.name}` : ''}`}
        action={
          canRequest ? (
            <Link
              to="/requests/new"
              className="rounded-lg bg-coral-500 px-4 py-2 text-sm font-medium text-ink hover:bg-coral-600"
            >
              Request a vehicle
            </Link>
          ) : undefined
        }
      />
      <div className="space-y-8">
        {isManager && <ManagerSummary />}
        {isHod && <HodSummary />}
        {canRequest && <MyUpcoming />}
      </div>
    </>
  );
}

function Stat({ label, value, to }: { label: string; value: number | undefined; to: string }) {
  return (
    <Link to={to} className="rounded-xl border border-sand-200 bg-white p-5 hover:border-coral-500">
      <div className="text-3xl font-semibold">{value ?? '–'}</div>
      <div className="mt-1 text-sm text-sand-600">{label}</div>
    </Link>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold text-sand-600">{title}</h2>
      {children}
    </section>
  );
}

function ManagerSummary() {
  const toAssign = useRequests('scope=all&status=approved');
  const assigned = useRequests('scope=all&status=assigned');
  const pending = useRequests('scope=all&status=pending_approval');
  return (
    <Section title="Transport">
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="To assign" value={toAssign.data?.length} to="/dispatch" />
        <Stat label="Assigned, not started" value={assigned.data?.length} to="/dispatch" />
        <Stat label="Awaiting HOD approval" value={pending.data?.length} to="/dispatch" />
      </div>
    </Section>
  );
}

function HodSummary() {
  const pending = useRequests('scope=approvals&status=pending_approval');
  return (
    <Section title="Waiting for your approval">
      <RequestList requests={pending.data} showRequester empty="You're all caught up." />
    </Section>
  );
}

function MyUpcoming() {
  const mine = useRequests('scope=mine');
  const upcoming = mine.data?.filter((r) =>
    ['pending_approval', 'approved', 'assigned', 'in_progress'].includes(r.status),
  );
  return (
    <Section title="My upcoming trips">
      <RequestList requests={upcoming} empty="No upcoming trips." />
    </Section>
  );
}
