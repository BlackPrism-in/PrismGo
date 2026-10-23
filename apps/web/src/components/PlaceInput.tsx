import { useId, useState } from 'react';
import { parseCoords } from '../lib/coords';
import type { Place } from '../lib/types';
import { Field, Input } from './ui';

/**
 * Address + coordinates. Until the Google Maps key is configured this is a plain
 * address field with a "lat, lng" box (paste from Google Maps) and recent places
 * as shortcuts. Google Places autocomplete replaces it once the key arrives.
 */
export function PlaceInput({
  label,
  value,
  onChange,
  recent,
}: {
  label: string;
  value: Place | null;
  onChange: (place: Place | null) => void;
  recent: Place[];
}) {
  const id = useId();
  const [address, setAddress] = useState(value?.address ?? '');
  const [coords, setCoords] = useState(value ? `${value.lat}, ${value.lng}` : '');
  const parsed = parseCoords(coords);
  const coordsError = coords && !parsed ? 'Enter as "26.7271, 88.3953"' : null;

  function update(nextAddress: string, nextCoords: string) {
    setAddress(nextAddress);
    setCoords(nextCoords);
    const c = parseCoords(nextCoords);
    onChange(nextAddress.trim().length >= 3 && c ? { address: nextAddress.trim(), ...c } : null);
  }

  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium text-sand-700">{label}</legend>
      <Input
        id={id}
        aria-label={`${label} address`}
        placeholder="Building, street, area"
        value={address}
        onChange={(e) => update(e.target.value, coords)}
      />
      <Field
        label="Coordinates"
        htmlFor={`${id}-coords`}
        error={coordsError}
        hint="Right-click the spot in Google Maps and copy the numbers"
      >
        <Input
          id={`${id}-coords`}
          aria-label={`${label} coordinates`}
          placeholder="26.7271, 88.3953"
          inputMode="decimal"
          value={coords}
          onChange={(e) => update(address, e.target.value)}
        />
      </Field>
      {recent.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {recent.map((p) => (
            <button
              key={`${p.address}-${p.lat}`}
              type="button"
              className="max-w-full truncate rounded-full border border-sand-300 bg-white px-3 py-1 text-xs text-sand-700 hover:border-coral-500"
              onClick={() => update(p.address, `${p.lat}, ${p.lng}`)}
            >
              {p.address}
            </button>
          ))}
        </div>
      )}
    </fieldset>
  );
}
