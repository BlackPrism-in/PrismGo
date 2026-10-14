import { describe, expect, it } from 'vitest';
import { bearing, distanceM, estimateMinutes, interpolate } from './geo';

const mgRoad = { lat: 12.9756, lng: 77.6066 };
const airport = { lat: 13.1989, lng: 77.7068 };

describe('geo', () => {
  it('measures MG Road to the airport at about 26.7 km', () => {
    expect(distanceM(mgRoad, airport) / 1000).toBeCloseTo(26.7, 0);
  });

  it('is zero for the same point', () => {
    expect(distanceM(mgRoad, mgRoad)).toBe(0);
  });

  it('interpolates halfway', () => {
    const mid = interpolate(mgRoad, airport, 0.5);
    expect(distanceM(mgRoad, mid)).toBeCloseTo(distanceM(mid, airport), -1);
  });

  it('points north-east toward the airport', () => {
    const b = bearing(mgRoad, airport);
    expect(b).toBeGreaterThan(15);
    expect(b).toBeLessThan(35);
  });

  it('estimates ETA with a road factor and a floor speed', () => {
    // 26.7 km × 1.3 ≈ 34.7 km at 22 km/h ≈ 95 min
    expect(estimateMinutes(mgRoad, airport)).toBeGreaterThan(85);
    expect(estimateMinutes(mgRoad, airport)).toBeLessThan(105);
    // Faster when actually moving faster
    expect(estimateMinutes(mgRoad, airport, 60)).toBeLessThan(40);
  });
});
