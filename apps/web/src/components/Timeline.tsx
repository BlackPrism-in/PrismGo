import { formatDateTime } from '../lib/format';
import type { TimelineEntry } from '../lib/types';

const LABELS: Record<TimelineEntry['type'], string> = {
  created: 'Request created',
  submitted: 'Submitted for approval',
  auto_approved: 'Approved (requester is the HOD)',
  approved: 'Approved',
  rejected: 'Not approved',
  assigned: 'Vehicle and driver assigned',
  reassigned: 'Vehicle or driver changed',
  started: 'Trip started',
  picked_up: 'Picked up',
  dropped: 'Dropped off',
  ended: 'Trip completed',
  gps_lost: 'GPS signal lost',
  cancelled: 'Cancelled',
};

export function Timeline({ entries }: { entries: TimelineEntry[] }) {
  return (
    <ol className="space-y-4">
      {entries.map((e, i) => (
        <li key={`${e.type}-${e.at}-${i}`} className="relative flex gap-3">
          <span
            aria-hidden
            className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${
              i === entries.length - 1 ? 'bg-coral-500' : 'bg-sand-300'
            }`}
          />
          <div className="text-sm">
            <div className="font-medium">{LABELS[e.type]}</div>
            <div className="text-sand-500">
              {formatDateTime(e.at)}
              {e.actorName ? ` · ${e.actorName}` : ''}
            </div>
            {e.note && <div className="mt-0.5 text-sand-700">“{e.note}”</div>}
          </div>
        </li>
      ))}
    </ol>
  );
}
