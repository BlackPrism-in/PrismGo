import type { RequestStatus } from '../lib/types';
import { Badge } from './ui';

const META: Record<
  RequestStatus,
  { label: string; tone: 'green' | 'amber' | 'red' | 'slate' | 'blue' }
> = {
  draft: { label: 'Draft', tone: 'slate' },
  pending_approval: { label: 'Awaiting approval', tone: 'amber' },
  approved: { label: 'Approved', tone: 'blue' },
  rejected: { label: 'Not approved', tone: 'red' },
  assigned: { label: 'Vehicle assigned', tone: 'green' },
  in_progress: { label: 'On the way', tone: 'green' },
  completed: { label: 'Completed', tone: 'slate' },
  cancelled: { label: 'Cancelled', tone: 'slate' },
};

export function RequestStatusBadge({ status }: { status: RequestStatus }) {
  const meta = META[status];
  return <Badge tone={meta.tone}>{meta.label}</Badge>;
}
