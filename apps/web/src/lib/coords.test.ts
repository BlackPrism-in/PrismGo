import { expect, it } from 'vitest';
import { parseCoords } from './coords';

it('parses "lat, lng" as copied from Google Maps', () => {
  expect(parseCoords('12.9716, 77.5946')).toEqual({ lat: 12.9716, lng: 77.5946 });
  expect(parseCoords(' 13.1989 ,77.7068 ')).toEqual({ lat: 13.1989, lng: 77.7068 });
});

it('rejects malformed or out-of-range values', () => {
  expect(parseCoords('12.9716')).toBeNull();
  expect(parseCoords('MG Road')).toBeNull();
  expect(parseCoords('95, 77')).toBeNull();
  expect(parseCoords('12, 190')).toBeNull();
});
