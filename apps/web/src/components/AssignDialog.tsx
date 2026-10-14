import { useState, type FormEvent } from 'react';
import { formatDateTime, formatTime } from '../lib/format';
import { useAvailability, useRequestAction } from '../lib/queries';
import type { TripRequest } from '../lib/types';
import { Button, ErrorBanner, Modal } from './ui';

const TWO_HOURS = 2 * 60 * 60 * 1000;

/** Pick a vehicle and driver for a request, or change them (reassign). */
export function AssignDialog({
  request,
  onClose,
}: {
  request: TripRequest | null;
  onClose: () => void;
}) {
  return (
    <Modal
      open={request !== null}
      title={
        request?.trip
          ? `Change vehicle or driver · ${request.code}`
          : `Assign · ${request?.code ?? ''}`
      }
      onClose={onClose}
    >
      {request && <AssignForm request={request} onDone={onClose} />}
    </Modal>
  );
}

function AssignForm({ request, onDone }: { request: TripRequest; onDone: () => void }) {
  const reassign = request.trip !== null;
  const from = request.trip?.scheduledStart ?? request.startAt;
  const to =
    request.trip?.scheduledEnd ??
    request.returnAt ??
    new Date(Date.parse(request.startAt) + TWO_HOURS).toISOString();
  const { data, isLoading, error } = useAvailability({ from, to, passengers: request.passengers });
  const action = useRequestAction();
  const [vehicleId, setVehicleId] = useState(request.trip?.vehicle.id ?? '');
  const [driverId, setDriverId] = useState(request.trip?.driver.id ?? '');

  // A trip's own booking shows as a conflict when reassigning; treat it as free.
  const ownsConflict = (c: { requestId: string } | null | undefined) => c?.requestId === request.id;

  function pickVehicle(id: string) {
    setVehicleId(id);
    // Suggest the driver who usually drives this vehicle, if free.
    const usual = data?.drivers.find(
      (d) => d.defaultVehicleId === id && (d.available || ownsConflict(d.conflict)),
    );
    if (usual && !driverId) setDriverId(usual.id);
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    const call = reassign
      ? {
          path: `/trips/${request.trip!.id}/reassign`,
          body: {
            ...(vehicleId !== request.trip!.vehicle.id ? { vehicleId } : {}),
            ...(driverId !== request.trip!.driver.id ? { driverId } : {}),
          },
        }
      : { path: `/requests/${request.id}/assign`, body: { vehicleId, driverId } };
    action.mutate(call, { onSuccess: onDone });
  }

  const unchanged =
    reassign && vehicleId === request.trip!.vehicle.id && driverId === request.trip!.driver.id;

  return (
    <form onSubmit={submit} className="space-y-4">
      <p className="text-sm text-sand-600">
        {formatDateTime(from)} – {formatTime(to)} · {request.passengers}{' '}
        {request.passengers === 1 ? 'person' : 'people'}
      </p>
      <ErrorBanner error={error} />
      {isLoading && <p className="text-sm text-sand-500">Checking availability…</p>}
      {data && (
        <>
          <fieldset>
            <legend className="mb-2 text-sm font-medium text-sand-700">Vehicle</legend>
            <div className="space-y-2">
              {data.vehicles.map((v) => {
                const free = v.available || ownsConflict(v.conflict);
                const usable = free && v.fits;
                return (
                  <label
                    key={v.id}
                    className={`flex items-center gap-3 rounded-lg border px-3 py-2 text-sm ${
                      vehicleId === v.id ? 'border-coral-500 bg-coral-50' : 'border-sand-200'
                    } ${usable ? 'cursor-pointer' : 'opacity-60'}`}
                  >
                    <input
                      type="radio"
                      name="vehicle"
                      value={v.id}
                      checked={vehicleId === v.id}
                      disabled={!usable}
                      onChange={() => pickVehicle(v.id)}
                    />
                    <span className="font-mono">{v.regNo}</span>
                    <span className="text-sand-600">
                      {v.type} · {v.seats} seats
                    </span>
                    <span className="ml-auto text-xs">
                      {!free ? (
                        `Busy: ${v.conflict!.requestCode}`
                      ) : !v.fits ? (
                        'Too few seats'
                      ) : (
                        <span className="text-mint-700">Free</span>
                      )}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>
          <fieldset>
            <legend className="mb-2 text-sm font-medium text-sand-700">Driver</legend>
            <div className="space-y-2">
              {data.drivers.map((d) => {
                const free = d.available || ownsConflict(d.conflict);
                return (
                  <label
                    key={d.id}
                    className={`flex items-center gap-3 rounded-lg border px-3 py-2 text-sm ${
                      driverId === d.id ? 'border-coral-500 bg-coral-50' : 'border-sand-200'
                    } ${free ? 'cursor-pointer' : 'opacity-60'}`}
                  >
                    <input
                      type="radio"
                      name="driver"
                      value={d.id}
                      checked={driverId === d.id}
                      disabled={!free}
                      onChange={() => setDriverId(d.id)}
                    />
                    <span>{d.name}</span>
                    {d.defaultVehicleId === vehicleId && vehicleId && (
                      <span className="text-xs text-sand-500">usually drives this vehicle</span>
                    )}
                    <span className="ml-auto text-xs">
                      {free ? (
                        <span className="text-mint-700">Free</span>
                      ) : (
                        `Busy: ${d.conflict!.requestCode}`
                      )}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        </>
      )}
      <ErrorBanner error={action.error} />
      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit" disabled={!vehicleId || !driverId || unchanged || action.isPending}>
          {action.isPending ? 'Saving…' : reassign ? 'Save change' : 'Assign'}
        </Button>
      </div>
    </form>
  );
}
