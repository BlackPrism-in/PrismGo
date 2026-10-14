import type { LiveVehicle, TripTrack } from './types';

/** Socket payload for `vehicle.position`. */
export interface VehiclePosition {
  vehicleId: string;
  lat: number;
  lng: number;
  speedKmh: number | null;
  heading: number | null;
  recordedAt: string;
  tripId: string | null;
  requestId: string | null;
  code: string | null;
  etaMinutes: number | null;
  etaTo: 'pickup' | 'drop';
}

/** Applies a live position to the live-vehicles list. */
export function applyToVehicles(list: LiveVehicle[] | undefined, p: VehiclePosition) {
  return list?.map((v) =>
    v.id === p.vehicleId
      ? {
          ...v,
          stale: false,
          position: {
            lat: p.lat,
            lng: p.lng,
            speedKmh: p.speedKmh,
            heading: p.heading,
            recordedAt: p.recordedAt,
          },
          trip:
            v.trip && v.trip.id === p.tripId
              ? { ...v.trip, etaMinutes: p.etaMinutes, etaTo: p.etaTo }
              : v.trip,
        }
      : v,
  );
}

/** Applies a live position to a trip track: moves the vehicle and extends the path while driving. */
export function applyToTrack(track: TripTrack | undefined, p: VehiclePosition) {
  if (!track || track.tripId !== p.tripId) return track;
  const position = {
    lat: p.lat,
    lng: p.lng,
    speedKmh: p.speedKmh,
    heading: p.heading,
    recordedAt: p.recordedAt,
  };
  return {
    ...track,
    position,
    etaMinutes: p.etaMinutes,
    etaTo: p.etaTo,
    points:
      track.status === 'in_progress'
        ? [...track.points, { lat: p.lat, lng: p.lng, at: p.recordedAt }]
        : track.points,
  };
}
