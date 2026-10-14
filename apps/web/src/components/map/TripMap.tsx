import { Marker, Polyline, Popup } from 'react-leaflet';
import { formatTime, timeAgo } from '../../lib/format';
import { useTrack } from '../../lib/queries';
import { BaseMap, FitBounds } from './BaseMap';
import { routeColors, stopIcon, vehicleIcon } from './icons';

/** Pickup, drop, driven path and the live vehicle for one trip. */
export function TripMap({ tripId }: { tripId: string }) {
  const { data: track, error } = useTrack(tripId);
  if (error)
    return <p className="text-sm text-sand-500">Map unavailable: {(error as Error).message}</p>;
  if (!track) return <div className="h-80 animate-pulse rounded-lg bg-sand-100" />;

  const pickup: [number, number] = [track.pickup.lat, track.pickup.lng];
  const drop: [number, number] = [track.drop.lat, track.drop.lng];
  const path = track.points.map((p) => [p.lat, p.lng] as [number, number]);
  const vehicle = track.position
    ? ([track.position.lat, track.position.lng] as [number, number])
    : null;
  const live = track.status === 'scheduled' || track.status === 'in_progress';
  const fitPoints = [pickup, drop, ...(vehicle ? [vehicle] : [])];

  return (
    <div className="space-y-2">
      {live && (
        <p className="text-sm">
          {track.position ? (
            <>
              <span className="font-semibold">
                {track.etaMinutes != null
                  ? `About ${track.etaMinutes} min to ${track.etaTo}`
                  : 'Live'}
              </span>
              <span className="text-sand-500"> · updated {timeAgo(track.position.recordedAt)}</span>
            </>
          ) : (
            <span className="text-sand-500">
              Waiting for the vehicle&apos;s first GPS position…
            </span>
          )}
        </p>
      )}
      <BaseMap className="h-80 rounded-lg">
        <FitBounds points={fitPoints} fitKey={`${tripId}-${!!vehicle}`} />
        <Polyline
          positions={[pickup, drop]}
          pathOptions={{ color: routeColors.planned, weight: 2, dashArray: '6 6' }}
        />
        {path.length > 1 && (
          <Polyline positions={path} pathOptions={{ color: routeColors.driven, weight: 4 }} />
        )}
        <Marker position={pickup} icon={stopIcon('pickup')}>
          <Popup>Pickup</Popup>
        </Marker>
        <Marker position={drop} icon={stopIcon('drop')}>
          <Popup>Drop</Popup>
        </Marker>
        {vehicle && live && (
          <Marker
            position={vehicle}
            icon={vehicleIcon(
              track.status === 'in_progress' ? 'on_trip' : 'idle',
              track.position?.heading,
              track.vehicleRegNo,
            )}
          >
            <Popup>
              {track.vehicleRegNo} · {track.position?.speedKmh ?? 0} km/h ·{' '}
              {formatTime(track.position!.recordedAt)}
            </Popup>
          </Marker>
        )}
      </BaseMap>
      <p className="text-xs text-sand-500">
        Dashed line: straight route. ETA is an estimate until road routing (Google) is connected.
      </p>
    </div>
  );
}
