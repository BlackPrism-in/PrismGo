import { expect, it } from 'vitest';
import { applyToTrack, applyToVehicles, type VehiclePosition } from './live';
import type { LiveVehicle, TripTrack } from './types';

const pos: VehiclePosition = {
  vehicleId: 'v1',
  lat: 13,
  lng: 77.7,
  speedKmh: 40,
  heading: 30,
  recordedAt: '2026-10-16T05:00:00Z',
  tripId: 't1',
  requestId: 'r1',
  code: 'PG-1001',
  etaMinutes: 12,
  etaTo: 'drop',
};

it('moves the matching vehicle and refreshes its trip ETA', () => {
  const list = [
    {
      id: 'v1',
      stale: true,
      position: null,
      trip: { id: 't1', etaMinutes: null, etaTo: 'pickup' },
    },
    { id: 'v2', stale: false, position: { lat: 1, lng: 1 }, trip: null },
  ] as unknown as LiveVehicle[];
  const next = applyToVehicles(list, pos)!;
  expect(next[0]).toMatchObject({
    stale: false,
    position: { lat: 13, lng: 77.7 },
    trip: { etaMinutes: 12, etaTo: 'drop' },
  });
  expect(next[1]).toBe(list[1]);
});

it('extends the driven path only while the trip is in progress', () => {
  const track = {
    tripId: 't1',
    status: 'in_progress',
    points: [{ lat: 12.9, lng: 77.6, at: 'x' }],
  } as unknown as TripTrack;
  expect(applyToTrack(track, pos)!.points).toHaveLength(2);
  const scheduled = { ...track, status: 'scheduled' } as TripTrack;
  expect(applyToTrack(scheduled, pos)!.points).toHaveLength(1);
  expect(applyToTrack(scheduled, pos)!.position).toMatchObject({ lat: 13 });
});

it('ignores positions for other trips', () => {
  const track = { tripId: 'other', status: 'in_progress', points: [] } as unknown as TripTrack;
  expect(applyToTrack(track, pos)).toBe(track);
});
