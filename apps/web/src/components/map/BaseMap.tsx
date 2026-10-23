import 'leaflet/dist/leaflet.css';
import L, { type LatLngExpression } from 'leaflet';
import { useEffect, type ReactNode } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';

// Siliguri, where the client's fleet runs; maps with markers fit to them instead.
const SILIGURI: LatLngExpression = [26.7187, 88.4250];

/**
 * Map canvas. Uses OpenStreetMap tiles until the Google Maps key is configured;
 * the markers and overlays on top don't change when the tiles do.
 */
export function BaseMap({
  children,
  className = '',
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <MapContainer center={SILIGURI} zoom={12} scrollWheelZoom className={`z-0 ${className}`}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {children}
    </MapContainer>
  );
}

/** Fits the view to the given points when `fitKey` changes (not on every live update). */
export function FitBounds({ points, fitKey }: { points: [number, number][]; fitKey: string }) {
  const map = useMap();
  useEffect(() => {
    if (points.length === 1) map.setView(points[0]!, 14);
    else if (points.length > 1)
      map.fitBounds(L.latLngBounds(points), { padding: [40, 40], maxZoom: 15 });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- refit only when the key changes
  }, [fitKey, map]);
  return null;
}

/** Pans to a point when it changes (e.g. a vehicle picked from a list). */
export function FlyTo({ to }: { to: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (to) map.flyTo(to, Math.max(map.getZoom(), 14), { duration: 0.6 });
  }, [to, map]);
  return null;
}
