import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '../redis/redis.service';
import type { PlaceDto } from './places.dto';

/** India's bounding box (minLon, minLat, maxLon, maxLat): results outside it are dropped. */
const INDIA_BBOX = '68.1,6.5,97.4,35.7';
const CACHE_TTL_S = 7 * 24 * 60 * 60;
const TIMEOUT_MS = 5000;

interface PhotonFeature {
  geometry: { coordinates: [number, number] };
  properties: Record<string, string | undefined>;
}

/**
 * Address search for the request form. Uses Photon (OpenStreetMap data, free, made for
 * search-as-you-type) through the API so clients never call a third party directly and
 * the provider can be swapped (e.g. Google Places) without an app update.
 * PLACES_BIAS="lat,lng" ranks nearby places first (default: Siliguri).
 */
@Injectable()
export class PlacesService {
  private readonly logger = new Logger(PlacesService.name);

  constructor(
    private readonly config: ConfigService,
    private readonly redis: RedisService,
  ) {}

  async search(raw: string): Promise<PlaceDto[]> {
    const q = raw.trim().replace(/\s+/g, ' ');
    const key = `places:${q.toLowerCase()}`;
    const cached = await this.redis.get(key).catch(() => null);
    if (cached) return JSON.parse(cached) as PlaceDto[];

    const [lat, lng] = (this.config.get<string>('PLACES_BIAS') ?? '26.7271,88.3953').split(',');
    const url = new URL(this.config.get<string>('PLACES_URL') ?? 'https://photon.komoot.io/api/');
    url.search = new URLSearchParams({
      q,
      lat: lat!.trim(),
      lon: lng!.trim(),
      bbox: INDIA_BBOX,
      limit: '8',
      lang: 'en',
    }).toString();

    let features: PhotonFeature[];
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'PrismGo/1.0 (vehicle requests)' },
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      features = ((await res.json()) as { features?: PhotonFeature[] }).features ?? [];
    } catch (err) {
      this.logger.warn(`Place search failed: ${(err as Error).message}`);
      throw new HttpException(
        'Address search is not available right now. Try again, or pick a recent place.',
        HttpStatus.FAILED_DEPENDENCY,
      );
    }

    const seen = new Set<string>();
    const places: PlaceDto[] = [];
    for (const f of features) {
      if (f.properties['countrycode'] !== 'IN') continue;
      const address = label(f.properties);
      if (!address || seen.has(address)) continue;
      seen.add(address);
      const [lon, la] = f.geometry.coordinates;
      places.push({ address, lat: round(la), lng: round(lon) });
      if (places.length === 6) break;
    }
    await this.redis.set(key, JSON.stringify(places), 'EX', CACHE_TTL_S).catch(() => undefined);
    return places;
  }
}

/** "City Centre, Sevoke Road, Siliguri, West Bengal" */
function label(p: Record<string, string | undefined>): string {
  const street =
    p['street'] && p['housenumber'] ? `${p['housenumber']} ${p['street']}` : p['street'];
  const parts = [p['name'], street, p['district'] ?? p['locality'], p['city'], p['state']];
  const out: string[] = [];
  for (const part of parts) {
    // Skip names with no Latin letters (OSM sometimes has only the Bengali name).
    if (part && /[A-Za-z]/.test(part) && !out.includes(part)) out.push(part);
  }
  return out.join(', ').slice(0, 300);
}

const round = (n: number) => Math.round(n * 1e6) / 1e6;
