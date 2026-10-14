import { VEHICLE_STATUSES, type VehicleStatus } from '@prismgo/shared';
import { useState, type FormEvent } from 'react';
import {
  Badge,
  Button,
  cellClass,
  DataTable,
  EmptyRow,
  ErrorBanner,
  Field,
  Modal,
  PageHeader,
  Select,
  TextField,
} from '../../components/ui';
import { statusLabel } from '../../lib/format';
import { useSave, useVehicles } from '../../lib/queries';
import type { UpdateVehicle, Vehicle } from '../../lib/types';

const STATUS_TONE = {
  available: 'green',
  on_trip: 'blue',
  maintenance: 'amber',
  inactive: 'slate',
} as const;

export function VehiclesPage() {
  const { data, isLoading, error } = useVehicles();
  const [editing, setEditing] = useState<Vehicle | 'new' | null>(null);

  return (
    <>
      <PageHeader
        title="Vehicles"
        description="Link each vehicle to its GPS tracker so it shows on the live map."
        action={<Button onClick={() => setEditing('new')}>Add vehicle</Button>}
      />
      <ErrorBanner error={error} />
      <DataTable head={['Reg no', 'Type', 'Make / model', 'Seats', 'GPS device', 'Status']}>
        {isLoading ? (
          <EmptyRow colSpan={6}>Loading…</EmptyRow>
        ) : !data?.length ? (
          <EmptyRow colSpan={6}>No vehicles yet.</EmptyRow>
        ) : (
          data.map((v) => (
            <tr
              key={v.id}
              className="cursor-pointer hover:bg-sand-50"
              onClick={() => setEditing(v)}
            >
              <td className={`${cellClass} font-mono font-medium`}>{v.regNo}</td>
              <td className={cellClass}>{v.type}</td>
              <td className={cellClass}>{[v.make, v.model].filter(Boolean).join(' ') || '—'}</td>
              <td className={cellClass}>{v.seats}</td>
              <td className={cellClass}>
                {v.gpsDeviceId ? (
                  <span className="font-mono text-xs">{v.gpsDeviceId}</span>
                ) : (
                  <span className="text-amber-700">Not linked</span>
                )}
              </td>
              <td className={cellClass}>
                <Badge tone={STATUS_TONE[v.status]}>{statusLabel(v.status)}</Badge>
              </td>
            </tr>
          ))
        )}
      </DataTable>
      <Modal
        open={editing !== null}
        title={
          editing === 'new'
            ? 'Add vehicle'
            : `Edit ${editing === null ? '' : (editing as Vehicle).regNo}`
        }
        onClose={() => setEditing(null)}
      >
        {editing !== null && (
          <VehicleForm
            vehicle={editing === 'new' ? null : editing}
            onDone={() => setEditing(null)}
          />
        )}
      </Modal>
    </>
  );
}

function VehicleForm({ vehicle, onDone }: { vehicle: Vehicle | null; onDone: () => void }) {
  const save = useSave<UpdateVehicle, Vehicle>('vehicles', ['vehicles']);
  const [regNo, setRegNo] = useState(vehicle?.regNo ?? '');
  const [type, setType] = useState(vehicle?.type ?? '');
  const [make, setMake] = useState(vehicle?.make ?? '');
  const [model, setModel] = useState(vehicle?.model ?? '');
  const [seats, setSeats] = useState(String(vehicle?.seats ?? 4));
  const [gpsDeviceId, setGpsDeviceId] = useState(vehicle?.gpsDeviceId ?? '');
  const [status, setStatus] = useState<VehicleStatus>(vehicle?.status ?? 'available');

  function submit(e: FormEvent) {
    e.preventDefault();
    const body: UpdateVehicle = {
      regNo,
      type,
      make: make || null,
      model: model || null,
      seats: Number(seats),
      gpsDeviceId: gpsDeviceId || null,
      ...(vehicle ? { status } : {}),
    };
    save.mutate({ id: vehicle?.id, body }, { onSuccess: onDone });
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <TextField
          label="Reg no"
          value={regNo}
          onChange={(e) => setRegNo(e.target.value)}
          placeholder="KA01AB1234"
          required
        />
        <TextField
          label="Type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          placeholder="Sedan"
          required
        />
        <TextField label="Make" value={make} onChange={(e) => setMake(e.target.value)} />
        <TextField label="Model" value={model} onChange={(e) => setModel(e.target.value)} />
        <TextField
          label="Seats"
          type="number"
          min={1}
          max={60}
          value={seats}
          onChange={(e) => setSeats(e.target.value)}
          required
        />
        {vehicle && (
          <Field label="Status">
            <Select value={status} onChange={(e) => setStatus(e.target.value as VehicleStatus)}>
              {VEHICLE_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {statusLabel(s)}
                </option>
              ))}
            </Select>
          </Field>
        )}
      </div>
      <TextField
        label="GPS device id"
        value={gpsDeviceId}
        onChange={(e) => setGpsDeviceId(e.target.value)}
        hint="The tracker's id in the GPS vendor's system"
      />
      <ErrorBanner error={save.error} />
      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit" disabled={save.isPending || !regNo || !type}>
          {save.isPending ? 'Saving…' : 'Save'}
        </Button>
      </div>
    </form>
  );
}
