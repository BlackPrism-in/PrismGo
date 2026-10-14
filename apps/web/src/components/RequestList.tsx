import { Link } from 'react-router';
import { formatDateTime } from '../lib/format';
import type { TripRequest } from '../lib/types';
import { RequestStatusBadge } from './RequestStatusBadge';

/** Compact request rows; `extra` renders per-row actions on the right. */
export function RequestList({
  requests,
  empty,
  showRequester = false,
  extra,
}: {
  requests: TripRequest[] | undefined;
  empty: string;
  showRequester?: boolean;
  extra?: (r: TripRequest) => React.ReactNode;
}) {
  if (!requests) return <p className="py-8 text-center text-sm text-sand-500">Loading…</p>;
  if (requests.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-sand-300 py-10 text-center text-sm text-sand-500">
        {empty}
      </p>
    );
  }
  return (
    <ul className="divide-y divide-sand-200 overflow-hidden rounded-xl border border-sand-200 bg-white">
      {requests.map((r) => (
        <li key={r.id} className="flex flex-wrap items-center gap-4 px-4 py-3 hover:bg-sand-50">
          <Link to={`/requests/${r.id}`} className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs text-sand-500">{r.code}</span>
              <RequestStatusBadge status={r.status} />
              <span className="text-sm font-medium">{formatDateTime(r.startAt)}</span>
            </div>
            <div className="mt-1 truncate text-sm text-sand-700">
              {r.pickup.address} → {r.drop.address}
            </div>
            <div className="mt-0.5 text-xs text-sand-500">
              {showRequester ? `${r.requester.name} · ${r.department.name} · ` : ''}
              {r.passengers} {r.passengers === 1 ? 'person' : 'people'} · {r.purpose}
              {r.trip ? ` · ${r.trip.vehicle.regNo}, ${r.trip.driver.name}` : ''}
            </div>
          </Link>
          {extra?.(r)}
        </li>
      ))}
    </ul>
  );
}
