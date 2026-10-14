import L from 'leaflet';

const CORAL = '#fc6b3f';
const MINT = '#84f2d6';
const INK = '#262525';
const SAND = '#a89d88';
const CREAM = '#fff6da';

export type VehicleState = 'on_trip' | 'idle' | 'stale';

/** Round vehicle marker; an arrow shows heading when it is moving. */
export function vehicleIcon(
  state: VehicleState,
  heading: number | null | undefined,
  label?: string,
) {
  const fill = state === 'on_trip' ? CORAL : state === 'idle' ? MINT : SAND;
  const arrow =
    heading != null && state !== 'stale'
      ? `<svg width="12" height="12" viewBox="0 0 12 12" style="transform:rotate(${heading}deg)"><path d="M6 1 L10 10 L6 8 L2 10 Z" fill="${INK}"/></svg>`
      : '';
  const tag = label
    ? `<span style="position:absolute;top:30px;left:50%;transform:translateX(-50%);white-space:nowrap;background:${INK};color:${CREAM};font:600 11px/1.6 ui-monospace,monospace;padding:0 6px;border-radius:6px">${label}</span>`
    : '';
  return L.divIcon({
    className: '',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
    html: `<div style="position:relative;width:28px;height:28px;border-radius:50%;background:${fill};border:2px solid ${INK};display:flex;align-items:center;justify-content:center;box-shadow:0 1px 4px rgba(0,0,0,.3)">${arrow}${tag}</div>`,
  });
}

/** Pickup (P) / drop (D) pin. */
export function stopIcon(kind: 'pickup' | 'drop') {
  const bg = kind === 'pickup' ? INK : CORAL;
  const fg = kind === 'pickup' ? CREAM : INK;
  return L.divIcon({
    className: '',
    iconSize: [26, 34],
    iconAnchor: [13, 34],
    popupAnchor: [0, -30],
    html: `<svg width="26" height="34" viewBox="0 0 26 34"><path d="M13 33 C13 33 2 20 2 12 A11 11 0 0 1 24 12 C24 20 13 33 13 33 Z" fill="${bg}" stroke="${INK}" stroke-width="1.5"/><text x="13" y="16" text-anchor="middle" font-family="system-ui" font-weight="700" font-size="11" fill="${fg}">${kind === 'pickup' ? 'P' : 'D'}</text></svg>`,
  });
}

export const routeColors = { driven: CORAL, planned: SAND };
