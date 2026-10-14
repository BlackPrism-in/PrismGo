import { useState, type FormEvent } from 'react';
import { useRequestAction } from '../lib/queries';
import type { TripRequest } from '../lib/types';
import { Button, ErrorBanner, Modal, TextField } from './ui';

export type Decision = 'approve' | 'reject' | 'cancel';

const COPY: Record<
  Decision,
  { title: string; label: string; hint: string; button: string; required: boolean }
> = {
  approve: {
    title: 'Approve',
    label: 'Comment',
    hint: 'Optional',
    button: 'Approve',
    required: false,
  },
  reject: {
    title: 'Decline',
    label: 'Reason',
    hint: 'The requester sees this',
    button: 'Decline',
    required: true,
  },
  cancel: {
    title: 'Cancel trip',
    label: 'Reason',
    hint: 'Optional. Shared with everyone involved',
    button: 'Cancel trip',
    required: false,
  },
};

/** Approve / decline (HOD) or cancel (requester, HOD, manager), with a note. */
export function DecisionDialog({
  request,
  decision,
  onClose,
}: {
  request: TripRequest | null;
  decision: Decision;
  onClose: () => void;
}) {
  const copy = COPY[decision];
  return (
    <Modal
      open={request !== null}
      title={`${copy.title} · ${request?.code ?? ''}`}
      onClose={onClose}
    >
      {request && <DecisionForm request={request} decision={decision} onDone={onClose} />}
    </Modal>
  );
}

function DecisionForm({
  request,
  decision,
  onDone,
}: {
  request: TripRequest;
  decision: Decision;
  onDone: () => void;
}) {
  const copy = COPY[decision];
  const action = useRequestAction();
  const [text, setText] = useState('');

  function submit(e: FormEvent) {
    e.preventDefault();
    const field = decision === 'cancel' ? 'reason' : 'comment';
    action.mutate(
      {
        path: `/requests/${request.id}/${decision}`,
        body: text.trim() ? { [field]: text.trim() } : {},
      },
      { onSuccess: onDone },
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <p className="text-sm text-sand-600">
        {request.requester.name} · {request.pickup.address} → {request.drop.address}
      </p>
      <TextField
        label={copy.label}
        value={text}
        onChange={(e) => setText(e.target.value)}
        hint={copy.hint}
        required={copy.required}
        autoFocus
      />
      <ErrorBanner error={action.error} />
      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={onDone}>
          Back
        </Button>
        <Button
          type="submit"
          variant={decision === 'approve' ? 'primary' : 'danger'}
          disabled={action.isPending || (copy.required && text.trim().length < 3)}
        >
          {action.isPending ? 'Saving…' : copy.button}
        </Button>
      </div>
    </form>
  );
}
