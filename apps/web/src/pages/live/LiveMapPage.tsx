import { useState } from 'react';
import { Link } from 'react-router';
import { Marker, Popup } from 'react-leaflet';
import { BaseMap, FitBounds, FlyTo } from '../../components/map/BaseMap';
import { vehicleIcon, type VehicleState } from '../../components/map/icons';
import { Badge, ErrorBanner, PageHeader } from '../../components/ui';
import { formatTime, timeAgo } from '../../lib/format';
import { useLiveVehicles } from '../../lib/queries';
import type { LiveVehicle } from '../../lib/types';

function stateOf(v: LiveVehicle): VehicleState {
  if (v.stale) return 'stale';
  return v.trip?.status === 'in_progress' ? 'on_trip' : 'idle';
}

const STATE_LABEL: Record<VehicleState, { text: string; tone: 'green' | 'blue' | 'slate' }> = {
  on_trip: { text: 'On a trip', tone: 'blue' },
  idle: { text: 'Idle', tone: 'green' },
  stale: { text: 'No recent GPS', tone: 'slate' },
};

export function LiveMapPage() {
  const { data, error, isLoading } = useLiveVehicles();
  const [focus, setFocus] = useState<[number, number] | null>(null);
  const located = (data ?? []).filter((v) => v.position);
  const onTrip = located.filter((v) => stateOf(v) === 'on_trip').length;

  return (
    <>
      <PageHeader
        title="Live map"
        description={
          data
            ? `${located.length} of ${data.length} vehicles reporting · ${onTrip} on a trip`
            : 'Loading vehicles…'
        }
      />
      <ErrorBanner error={error} />
      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <ul className="max-h-[70vh] space-y-2 overflow-y-auto pr-1">
          {isLoading && <li className="text-sm text-sand-500">Loading…</li>}
          {data?.map((v) => {
            const state = stateOf(v);
            return (
              <li key={v.id}>
                <button
                  type="button"
                  disabled={!v.position}
                  onClick={() => v.position && setFocus([v.position.lat, v.position.lng])}
                  className="w-full rounded-xl border border-sand-200 bg-white p-3 text-left hover:border-coral-500 disabled:cursor-default disabled:hover:border-sand-200"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono font-semibold">{v.regNo}</span>
                    <Badge tone={STATE_LABEL[state].tone}>{STATE_LABEL[state].text}</Badge>
                  </div>
                  {v.trip ? (
                    <div className="mt-1 text-sm">
                      <Link
                        to={`/requests/${v.trip.requestId}`}
                        className="text-coral-700 hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {v.trip.code}
                      </Link>{' '}
                      · {v.trip.requesterName}
                      <div className="text-xs text-sand-600">
                        {v.trip.status === 'in_progress'
                          ? `To ${v.trip.dropAddress}`
                          : `Pickup ${formatTime(v.trip.scheduledStart)} at ${v.trip.pickupAddress}`}
                        {v.trip.etaMinutes != null && ` · ~${v.trip.etaMinutes} min`}
                      </div>
                    </div>
                  ) : (
                    <div className="mt-1 text-xs text-sand-500">No trip in the next hour</div>
                  )}
                  <div className="mt-1 text-xs text-sand-500">
                    {v.position
                      ? `GPS ${timeAgo(v.position.recordedAt)}`
                      : v.gpsDeviceId
                        ? 'No GPS yet'
                        : 'No tracker linked'}
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
        <BaseMap className="h-[70vh] rounded-xl border border-sand-200">
          <FitBounds
            points={located.map((v) => [v.position!.lat, v.position!.lng])}
            fitKey={located.map((v) => v.id).join(',')}
          />
          <FlyTo to={focus} />
          {located.map((v) => (
            <Marker
              key={v.id}
              position={[v.position!.lat, v.position!.lng]}
              icon={vehicleIcon(stateOf(v), v.position!.heading, v.regNo)}
            >
              <Popup>
                <div className="space-y-1 text-sm">
                  <div className="font-mono font-semibold">{v.regNo}</div>
                  {v.trip && (
                    <div>
                      <Link to={`/requests/${v.trip.requestId}`}>{v.trip.code}</Link> ·{' '}
                      {v.trip.requesterName}
                    </div>
                  )}
                  <div>
                    {v.position!.speedKmh ?? 0} km/h · {timeAgo(v.position!.recordedAt)}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </BaseMap>
      </div>
    </>
  );
}
