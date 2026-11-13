import { useEffect, useId, useRef, useState } from 'react';
import { ApiError, get } from '../lib/api';
import type { Place } from '../lib/types';

/**
 * An address the user picks from search suggestions (API `/places/search`) or recent
 * places, so every pickup and drop is a real, located place. Typing alone is not accepted.
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
  const [text, setText] = useState(value?.address ?? '');
  const [selected, setSelected] = useState<Place | null>(value);
  const [suggestions, setSuggestions] = useState<Place[]>([]);
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const searchId = useRef(0);

  useEffect(() => {
    const query = text.trim();
    if (selected || query.length < 3) return;
    const current = ++searchId.current;
    const timer = setTimeout(() => {
      setSearching(true);
      get<Place[]>(`/places/search?q=${encodeURIComponent(query)}`)
        .then((places) => {
          if (current !== searchId.current) return;
          setSuggestions(places);
          setSearched(true);
        })
        .catch((err: unknown) => {
          if (current !== searchId.current) return;
          setSuggestions([]);
          setSearchError(
            err instanceof ApiError ? err.message : 'Address search failed. Try again.',
          );
        })
        .finally(() => current === searchId.current && setSearching(false));
    }, 400);
    return () => clearTimeout(timer);
  }, [text, selected]);

  function type(next: string) {
    setText(next);
    setSearched(false);
    setSearchError(null);
    if (next.trim().length < 3) setSuggestions([]);
    if (selected) {
      setSelected(null);
      onChange(null);
    }
  }

  function pick(place: Place) {
    searchId.current++;
    setText(place.address);
    setSelected(place);
    setSuggestions([]);
    setSearching(false);
    setSearched(false);
    setSearchError(null);
    onChange(place);
  }

  const query = text.trim();
  const error =
    selected || !query
      ? null
      : (searchError ??
        (query.length < 3
          ? 'Type at least 3 letters'
          : searched && suggestions.length === 0
            ? 'No matching place. Try an area, road or landmark nearby.'
            : searched
              ? 'Choose an address from the list'
              : null));

  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium text-sand-700">{label}</legend>
      <div className="relative">
        <input
          id={id}
          aria-label={`${label} address`}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          placeholder="Search area, road or landmark"
          autoComplete="off"
          value={text}
          onChange={(e) => type(e.target.value)}
          className="block w-full rounded-lg border border-sand-300 bg-white px-3 py-2 pr-9 text-sm shadow-sm placeholder:text-sand-400 focus:border-coral-500 focus:ring-2 focus:ring-coral-100 focus:outline-none"
        />
        <span className="absolute inset-y-0 right-3 flex items-center text-xs" aria-hidden>
          {searching ? '…' : selected ? <span className="text-mint-700">✓</span> : null}
        </span>
      </div>
      {suggestions.length > 0 && (
        <ul
          aria-label={`${label} suggestions`}
          className="divide-y divide-sand-100 rounded-lg border border-sand-200 bg-white shadow-sm"
        >
          {suggestions.map((p) => (
            <li key={`${p.address}-${p.lat}-${p.lng}`}>
              <button
                type="button"
                className="block w-full px-3 py-2 text-left text-sm hover:bg-sand-50"
                onClick={() => pick(p)}
              >
                {p.address}
              </button>
            </li>
          ))}
        </ul>
      )}
      {error && (
        <p id={`${id}-error`} className="text-xs text-red-600">
          {error}
        </p>
      )}
      {!selected && recent.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {recent.map((p) => (
            <button
              key={`${p.address}-${p.lat}`}
              type="button"
              className="max-w-full truncate rounded-full border border-sand-300 bg-white px-3 py-1 text-xs text-sand-700 hover:border-coral-500"
              onClick={() => pick(p)}
            >
              {p.address}
            </button>
          ))}
        </div>
      )}
    </fieldset>
  );
}
