import type { GpsPointDto } from '../tracking.dto';

/**
 * Trakzee "Token Based Pull API" (the client's GPS vendor):
 *   1. POST {base}?token=generateAccessToken            body {username, password}  → token
 *   2. POST {base}?token=getTokenBaseLiveData&ProjectId  header auth-code: <token>
 *      body {company_names, vehicle_nos, imei_nos, format: "json"} (comma-separated lists)
 *      → {"root":{"VehicleData":[{...one row per vehicle...}]}}
 */

export interface TrakzeeConfig {
  baseUrl: string;
  username: string;
  password: string;
  projectId: string;
  company: string;
  /** Offset of the vendor's timestamps, e.g. "+05:30" (they send local time without a zone). */
  timeZone: string;
  timeoutMs?: number;
}

export interface TrakzeeVehicle {
  regNo: string;
  imei: string;
}

/** One row of VehicleData; every value arrives as a string, "--" when missing. */
export type TrakzeeRow = Record<string, unknown>;

export class TrakzeeError extends Error {}

const str = (v: unknown): string | null => {
  if (v === null || v === undefined) return null;
  const s = String(v).trim();
  return s === '' || s === '--' ? null : s;
};

const num = (v: unknown): number | null => {
  const s = str(v);
  if (s === null) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
};

/** "22-03-2023 16:22:26" in the vendor's zone → ISO UTC, or null if unreadable. */
export function parseVendorTime(value: unknown, timeZone: string): string | null {
  const m = /^(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2}):(\d{2})$/.exec(str(value) ?? '');
  if (!m) return null;
  const [, dd, mm, yyyy, hh, mi, ss] = m;
  const t = Date.parse(`${yyyy}-${mm}-${dd}T${hh}:${mi}:${ss}${timeZone}`);
  return Number.isNaN(t) ? null : new Date(t).toISOString();
}

/** Registration numbers as the vendor writes them: upper case, no spaces or dashes. */
export const vendorRegNo = (regNo: string): string => regNo.replace(/[\s-]/g, '').toUpperCase();

/**
 * One vendor row → a webhook point, or null when it has no usable fix.
 * Odometer is left out until the vendor confirms its unit; trip distance then comes
 * from the GPS path.
 */
export function toGpsPoint(row: TrakzeeRow, timeZone: string): GpsPointDto | null {
  const deviceId = str(row['Imeino']);
  const lat = num(row['Latitude']);
  const lng = num(row['Longitude']);
  const recordedAt =
    parseVendorTime(row['GPSActualTime'], timeZone) ?? parseVendorTime(row['Datetime'], timeZone);
  if (!deviceId || lat === null || lng === null || !recordedAt) return null;
  if ((lat === 0 && lng === 0) || Math.abs(lat) > 90 || Math.abs(lng) > 180) return null;

  const ign = str(row['IGN'])?.toUpperCase();
  const point: GpsPointDto = { deviceId, recordedAt, lat, lng };
  const speed = num(row['Speed']);
  const heading = num(row['Angle']);
  if (speed !== null && speed >= 0) point.speedKmh = speed;
  if (heading !== null && heading >= 0 && heading < 360) point.heading = heading;
  if (ign === 'ON' || ign === 'OFF') point.ignition = ign === 'ON';
  return point;
}

/** Finds the token in the login response without assuming its exact shape. */
export function extractToken(body: unknown): string | null {
  if (typeof body === 'string') return body.trim() || null;
  if (!body || typeof body !== 'object') return null;
  for (const [key, value] of Object.entries(body)) {
    if (typeof value === 'string' && /token|auth/i.test(key) && value.length >= 16) return value;
  }
  for (const value of Object.values(body)) {
    const found = typeof value === 'object' ? extractToken(value) : null;
    if (found) return found;
  }
  return null;
}

const parseJson = (text: string): unknown => {
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
};

/** Short description of an unexpected response for logs; never includes credentials. */
const summarize = (status: number, text: string): string =>
  `HTTP ${status}: ${text.slice(0, 200).replace(/\s+/g, ' ')}`;

export class TrakzeeClient {
  private token: string | null = null;

  constructor(
    private readonly config: TrakzeeConfig,
    private readonly fetchFn: typeof fetch = fetch,
  ) {}

  get timeZone(): string {
    return this.config.timeZone;
  }

  /** Latest row per vehicle. Logs in when needed, and once more if the token was rejected. */
  async live(vehicles: TrakzeeVehicle[]): Promise<TrakzeeRow[]> {
    if (vehicles.length === 0) return [];
    if (!this.token) this.token = await this.login();
    try {
      return await this.fetchLive(this.token, vehicles);
    } catch (err) {
      if (!(err instanceof TrakzeeError)) throw err;
      this.token = await this.login();
      return this.fetchLive(this.token, vehicles);
    }
  }

  private url(action: string): string {
    const u = new URL(this.config.baseUrl);
    u.searchParams.set('token', action);
    if (action === 'getTokenBaseLiveData') u.searchParams.set('ProjectId', this.config.projectId);
    return u.toString();
  }

  private async post(
    action: string,
    body: unknown,
    headers: Record<string, string> = {},
  ): Promise<{ status: number; text: string }> {
    const res = await this.fetchFn(this.url(action), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(this.config.timeoutMs ?? 10_000),
    });
    return { status: res.status, text: await res.text() };
  }

  private async login(): Promise<string> {
    const { status, text } = await this.post('generateAccessToken', {
      username: this.config.username,
      password: this.config.password,
    });
    // The token may come back as JSON or as plain text.
    const body = parseJson(text) ?? text;
    const token = status === 200 ? extractToken(body) : null;
    // Status only: the body of a successful login is the token itself.
    if (!token) throw new Error(`GPS vendor login failed (HTTP ${status})`);
    return token;
  }

  private async fetchLive(token: string, vehicles: TrakzeeVehicle[]): Promise<TrakzeeRow[]> {
    const { status, text } = await this.post(
      'getTokenBaseLiveData',
      {
        company_names: this.config.company,
        vehicle_nos: vehicles.map((v) => vendorRegNo(v.regNo)).join(','),
        imei_nos: vehicles.map((v) => v.imei).join(','),
        format: 'json',
      },
      { 'auth-code': token },
    );
    const body = parseJson(text) as { root?: { VehicleData?: unknown } } | null;
    const rows = body?.root?.VehicleData;
    if (status !== 200 || !Array.isArray(rows)) throw new TrakzeeError(summarize(status, text));
    return rows as TrakzeeRow[];
  }
}
