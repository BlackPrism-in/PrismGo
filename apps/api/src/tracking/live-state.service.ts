import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '../redis/redis.service';

/** A vehicle's latest known position, as kept in Redis. */
export interface LivePosition {
  vehicleId: string;
  lat: number;
  lng: number;
  speedKmh: number | null;
  heading: number | null;
  ignition: boolean | null;
  odometerKm: number | null;
  recordedAt: string;
}

/** Per-trip detector memory: whether the vehicle has been seen at pickup / drop. */
export interface TripState {
  seenAtPickup?: boolean;
  seenAtDrop?: boolean;
  gpsLostAlerted?: boolean;
}

const TRIP_STATE_TTL_S = 3 * 24 * 60 * 60;

/**
 * Hot state for live tracking. Latest positions live here so the map never queries
 * the GPS history table; the detector's small per-trip memory lives here too.
 */
@Injectable()
export class LiveStateService {
  private readonly lastEmit = new Map<string, number>();
  /** Keyed by database so dev and test sharing one Redis never mix live state. */
  private readonly prefix: string;

  constructor(
    private readonly redis: RedisService,
    config: ConfigService,
  ) {
    const db = new URL(config.getOrThrow<string>('DATABASE_URL')).pathname.slice(1);
    this.prefix = `live:${db}`;
  }

  private latestKey(orgId: string): string {
    return `${this.prefix}:${orgId}:latest`;
  }

  private tripKey(tripId: string): string {
    return `${this.prefix}:trip:${tripId}`;
  }

  private async client(): Promise<RedisService> {
    if (this.redis.status === 'wait') await this.redis.connect();
    return this.redis;
  }

  /** Stores the position only if it is newer than what is stored. Returns true if stored. */
  async setLatest(orgId: string, p: LivePosition): Promise<boolean> {
    const r = await this.client();
    const current = await r.hget(this.latestKey(orgId), p.vehicleId);
    if (current) {
      const prev = JSON.parse(current) as LivePosition;
      if (Date.parse(prev.recordedAt) >= Date.parse(p.recordedAt)) return false;
    }
    await r.hset(this.latestKey(orgId), p.vehicleId, JSON.stringify(p));
    return true;
  }

  async latestAll(orgId: string): Promise<Map<string, LivePosition>> {
    const r = await this.client();
    const all = await r.hgetall(this.latestKey(orgId));
    return new Map(Object.entries(all).map(([id, json]) => [id, JSON.parse(json) as LivePosition]));
  }

  async latest(orgId: string, vehicleId: string): Promise<LivePosition | null> {
    const r = await this.client();
    const json = await r.hget(this.latestKey(orgId), vehicleId);
    return json ? (JSON.parse(json) as LivePosition) : null;
  }

  async tripState(tripId: string): Promise<TripState> {
    const r = await this.client();
    const json = await r.get(this.tripKey(tripId));
    return json ? (JSON.parse(json) as TripState) : {};
  }

  async setTripState(tripId: string, state: TripState): Promise<void> {
    const r = await this.client();
    await r.set(this.tripKey(tripId), JSON.stringify(state), 'EX', TRIP_STATE_TTL_S);
  }

  /** At most one live push per vehicle every `intervalMs` (per API instance). */
  shouldEmit(vehicleId: string, intervalMs = 3000): boolean {
    const now = Date.now();
    const last = this.lastEmit.get(vehicleId) ?? 0;
    if (now - last < intervalMs) return false;
    this.lastEmit.set(vehicleId, now);
    return true;
  }
}
