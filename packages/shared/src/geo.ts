export interface LatLng {
  lat: number;
  lng: number;
}

const EARTH_RADIUS_M = 6_371_000;
const rad = (deg: number) => (deg * Math.PI) / 180;

/** Great-circle distance in metres. */
export function distanceM(a: LatLng, b: LatLng): number {
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(h));
}

/** Point a fraction `t` (0..1) of the way from a to b. Fine for city-scale distances. */
export function interpolate(a: LatLng, b: LatLng, t: number): LatLng {
  return { lat: a.lat + (b.lat - a.lat) * t, lng: a.lng + (b.lng - a.lng) * t };
}

/** Initial bearing from a to b, degrees clockwise from north. */
export function bearing(a: LatLng, b: LatLng): number {
  const y = Math.sin(rad(b.lng - a.lng)) * Math.cos(rad(b.lat));
  const x =
    Math.cos(rad(a.lat)) * Math.sin(rad(b.lat)) -
    Math.sin(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.cos(rad(b.lng - a.lng));
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

/** Roads are longer than the straight line; 1.3 is a common urban detour factor. */
export const ROAD_FACTOR = 1.3;
/** Assumed city speed when the vehicle is stopped or slow. */
export const CITY_SPEED_KMH = 22;

/**
 * Rough minutes to cover the straight-line distance from `from` to `to` by road.
 * Used until Google Directions is configured.
 */
export function estimateMinutes(from: LatLng, to: LatLng, speedKmh?: number | null): number {
  const km = (distanceM(from, to) * ROAD_FACTOR) / 1000;
  const speed = Math.max(speedKmh ?? 0, CITY_SPEED_KMH);
  return Math.max(1, Math.round((km / speed) * 60));
}
