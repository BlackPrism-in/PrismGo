import type { Role } from './roles';
import type { RequestStatus } from './statuses';

export type RequestAction =
  'submit' | 'cancel' | 'approve' | 'reject' | 'assign' | 'start' | 'complete';

interface Transition {
  from: readonly RequestStatus[];
  to: RequestStatus;
  /** Roles allowed to take this action. 'system' = trip detector / background job. */
  by: readonly (Role | 'system')[];
}

export const REQUEST_TRANSITIONS: Record<RequestAction, Transition> = {
  submit: { from: ['draft'], to: 'pending_approval', by: ['requester', 'hod'] },
  cancel: {
    from: ['draft', 'pending_approval', 'approved', 'assigned'],
    to: 'cancelled',
    by: ['requester', 'hod', 'transport_manager'],
  },
  approve: { from: ['pending_approval'], to: 'approved', by: ['hod'] },
  reject: { from: ['pending_approval'], to: 'rejected', by: ['hod'] },
  assign: { from: ['approved'], to: 'assigned', by: ['transport_manager'] },
  start: { from: ['assigned'], to: 'in_progress', by: ['transport_manager', 'system'] },
  complete: { from: ['in_progress'], to: 'completed', by: ['transport_manager', 'system'] },
};

/** Returns the next status, or null when the action is not allowed from `current`. */
export function nextRequestStatus(
  current: RequestStatus,
  action: RequestAction,
): RequestStatus | null {
  const t = REQUEST_TRANSITIONS[action];
  return t.from.includes(current) ? t.to : null;
}

export function canPerform(action: RequestAction, actor: Role | 'system'): boolean {
  return REQUEST_TRANSITIONS[action].by.includes(actor);
}
