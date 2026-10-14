import { DRIVER_STATUSES, formatIndianMobile, type DriverStatus } from '@prismgo/shared';
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
import { useDrivers, useSave, useVehicles } from '../../lib/queries';
import type { Driver, UpdateDriver } from '../../lib/types';
import { statusLabel } from '../../lib/format';

const DAY_MS = 24 * 60 * 60 * 1000;

/** Licence expiry badge: red when expired, amber within 30 days. */
export function LicenceExpiry({ date, today }: { date: string | null; today: Date }) {
  if (!date) return <span className="text-sand-400">—</span>;
  const days = Math.floor((Date.parse(date) - today.getTime()) / DAY_MS);
  if (days < 0) return <Badge tone="red">Expired {date}</Badge>;
  if (days <= 30)
    return (
      <Badge tone="amber">
        {date} · {days}d left
      </Badge>
    );
  return <span>{date}</span>;
}

export function DriversPage() {
  const { data, isLoading, error } = useDrivers();
  const [editing, setEditing] = useState<Driver | 'new' | null>(null);
  const [today] = useState(() => new Date());

  return (
    <>
      <PageHeader
        title="Drivers"
        description="Drivers don't log in. They get trip details on WhatsApp."
        action={<Button onClick={() => setEditing('new')}>Add driver</Button>}
      />
      <ErrorBanner error={error} />
      <DataTable head={['Name', 'Phone', 'Licence', 'Licence expiry', 'Usual vehicle', 'Status']}>
        {isLoading ? (
          <EmptyRow colSpan={6}>Loading…</EmptyRow>
        ) : !data?.length ? (
          <EmptyRow colSpan={6}>No drivers yet.</EmptyRow>
        ) : (
          data.map((d) => (
            <tr
              key={d.id}
              className="cursor-pointer hover:bg-sand-50"
              onClick={() => setEditing(d)}
            >
              <td className={`${cellClass} font-medium`}>{d.name}</td>
              <td className={`${cellClass} text-sand-600`}>{formatIndianMobile(d.phone)}</td>
              <td className={`${cellClass} font-mono text-xs`}>{d.licenceNo}</td>
              <td className={cellClass}>
                <LicenceExpiry date={d.licenceExpiry ?? null} today={today} />
              </td>
              <td className={`${cellClass} font-mono text-xs`}>{d.defaultVehicle?.regNo ?? '—'}</td>
              <td className={cellClass}>
                <Badge
                  tone={
                    d.status === 'active' ? 'green' : d.status === 'on_leave' ? 'amber' : 'slate'
                  }
                >
                  {statusLabel(d.status)}
                </Badge>
              </td>
            </tr>
          ))
        )}
      </DataTable>
      <Modal
        open={editing !== null}
        title={editing === 'new' ? 'Add driver' : 'Edit driver'}
        onClose={() => setEditing(null)}
      >
        {editing !== null && (
          <DriverForm driver={editing === 'new' ? null : editing} onDone={() => setEditing(null)} />
        )}
      </Modal>
    </>
  );
}

function DriverForm({ driver, onDone }: { driver: Driver | null; onDone: () => void }) {
  const vehicles = useVehicles();
  const save = useSave<UpdateDriver, Driver>('drivers', ['drivers']);
  const [name, setName] = useState(driver?.name ?? '');
  const [phone, setPhone] = useState(driver ? formatIndianMobile(driver.phone) : '');
  const [licenceNo, setLicenceNo] = useState(driver?.licenceNo ?? '');
  const [licenceExpiry, setLicenceExpiry] = useState(driver?.licenceExpiry ?? '');
  const [defaultVehicleId, setDefaultVehicleId] = useState(driver?.defaultVehicle?.id ?? '');
  const [status, setStatus] = useState<DriverStatus>(driver?.status ?? 'active');

  function submit(e: FormEvent) {
    e.preventDefault();
    const body: UpdateDriver = {
      name,
      phone,
      licenceNo,
      licenceExpiry: licenceExpiry || null,
      defaultVehicleId: defaultVehicleId || null,
      ...(driver ? { status } : {}),
    };
    save.mutate({ id: driver?.id, body }, { onSuccess: onDone });
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
      <TextField
        label="Mobile number"
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        hint="Trip details are sent here on WhatsApp"
        required
      />
      <div className="grid grid-cols-2 gap-4">
        <TextField
          label="Licence no"
          value={licenceNo}
          onChange={(e) => setLicenceNo(e.target.value)}
          required
        />
        <TextField
          label="Licence expiry"
          type="date"
          value={licenceExpiry}
          onChange={(e) => setLicenceExpiry(e.target.value)}
        />
        <Field label="Usual vehicle">
          <Select value={defaultVehicleId} onChange={(e) => setDefaultVehicleId(e.target.value)}>
            <option value="">None</option>
            {vehicles.data?.map((v) => (
              <option key={v.id} value={v.id}>
                {v.regNo}
              </option>
            ))}
          </Select>
        </Field>
        {driver && (
          <Field label="Status">
            <Select value={status} onChange={(e) => setStatus(e.target.value as DriverStatus)}>
              {DRIVER_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {statusLabel(s)}
                </option>
              ))}
            </Select>
          </Field>
        )}
      </div>
      <ErrorBanner error={save.error} />
      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit" disabled={save.isPending || !name || !phone || !licenceNo}>
          {save.isPending ? 'Saving…' : 'Save'}
        </Button>
      </div>
    </form>
  );
}
