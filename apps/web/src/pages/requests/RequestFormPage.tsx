import { useMemo, useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router';
import { PlaceInput } from '../../components/PlaceInput';
import { Button, ErrorBanner, PageHeader, TextField } from '../../components/ui';
import { patch, post } from '../../lib/api';
import { fromLocalInput, toLocalInput } from '../../lib/format';
import { useRequest, useRequests } from '../../lib/queries';
import type { CreateRequest, Place, TripRequest } from '../../lib/types';
import { useQueryClient } from '@tanstack/react-query';

/** New request (/requests/new) or edit (/requests/:id/edit). */
export function RequestFormPage() {
  const { id } = useParams();
  const existing = useRequest(id ?? '');
  if (id && !existing.data) {
    return (
      <p className="text-sm text-sand-500">
        {existing.error ? (existing.error as Error).message : 'Loading…'}
      </p>
    );
  }
  return <RequestForm existing={id ? existing.data! : null} />;
}

function RequestForm({ existing }: { existing: TripRequest | null }) {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const mine = useRequests('scope=mine');
  const [pickup, setPickup] = useState<Place | null>(existing?.pickup ?? null);
  const [drop, setDrop] = useState<Place | null>(existing?.drop ?? null);
  const [startAt, setStartAt] = useState(existing ? toLocalInput(existing.startAt) : '');
  const [returnAt, setReturnAt] = useState(
    existing?.returnAt ? toLocalInput(existing.returnAt) : '',
  );
  const [passengers, setPassengers] = useState(String(existing?.passengers ?? 1));
  const [purpose, setPurpose] = useState(existing?.purpose ?? '');
  const [notes, setNotes] = useState(existing?.notes ?? '');
  const [error, setError] = useState<unknown>(null);
  const [busy, setBusy] = useState(false);

  // Up to 6 distinct places from earlier requests, as one-tap shortcuts.
  const recent = useMemo(() => {
    const seen = new Map<string, Place>();
    for (const r of mine.data ?? []) {
      for (const p of [r.pickup, r.drop]) if (!seen.has(p.address)) seen.set(p.address, p);
    }
    return [...seen.values()].slice(0, 6);
  }, [mine.data]);

  const ready = pickup && drop && startAt && Number(passengers) >= 1 && purpose.trim().length >= 3;

  async function save(e: FormEvent, submit: boolean) {
    e.preventDefault();
    if (!ready) return;
    setBusy(true);
    setError(null);
    const body: CreateRequest = {
      pickup: pickup!,
      drop: drop!,
      startAt: fromLocalInput(startAt),
      returnAt: returnAt ? fromLocalInput(returnAt) : null,
      passengers: Number(passengers),
      purpose: purpose.trim(),
      notes: notes.trim() || null,
    };
    try {
      const saved = existing
        ? await patch<TripRequest>(`/requests/${existing.id}`, body)
        : await post<TripRequest>('/requests', { ...body, submit });
      await qc.invalidateQueries({ queryKey: ['requests'] });
      qc.setQueryData(['request', saved.id], saved);
      void navigate(`/requests/${saved.id}`);
    } catch (err) {
      setError(err);
      setBusy(false);
    }
  }

  return (
    <>
      <PageHeader
        title={existing ? `Edit ${existing.code}` : 'New vehicle request'}
        description={
          existing
            ? 'Changes go to your HOD with the request.'
            : 'Your HOD approves it, then transport assigns a vehicle.'
        }
      />
      <form
        onSubmit={(e) => void save(e, true)}
        className="max-w-2xl space-y-6 rounded-xl border border-sand-200 bg-white p-6"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <PlaceInput label="Pickup" value={pickup} onChange={setPickup} recent={recent} />
          <PlaceInput label="Drop" value={drop} onChange={setDrop} recent={recent} />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <TextField
            label="Pickup time"
            type="datetime-local"
            value={startAt}
            onChange={(e) => setStartAt(e.target.value)}
            required
          />
          <TextField
            label="Return time"
            type="datetime-local"
            value={returnAt}
            onChange={(e) => setReturnAt(e.target.value)}
            hint="Optional"
          />
          <TextField
            label="People"
            type="number"
            min={1}
            max={60}
            value={passengers}
            onChange={(e) => setPassengers(e.target.value)}
            required
          />
        </div>
        <TextField
          label="Purpose"
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          placeholder="Client meeting, airport drop…"
          required
        />
        <TextField
          label="Notes for transport"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          hint="Optional: luggage, accessibility, contact on site"
        />
        <ErrorBanner error={error} />
        <div className="flex flex-wrap justify-end gap-2">
          <Button variant="ghost" onClick={() => void navigate(-1)}>
            Cancel
          </Button>
          {!existing && (
            <Button
              variant="secondary"
              disabled={busy || !ready}
              onClick={(e) => void save(e, false)}
            >
              Save draft
            </Button>
          )}
          <Button type="submit" disabled={busy || !ready}>
            {busy ? 'Saving…' : existing ? 'Save changes' : 'Submit for approval'}
          </Button>
        </div>
      </form>
    </>
  );
}
