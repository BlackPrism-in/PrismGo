/**
 * Checks the GPS vendor connection with the GPS_VENDOR_* settings in .env, without
 * changing anything: logs in, fetches live data and shows how each row maps.
 *
 *   pnpm --filter @prismgo/api gps:check                          # vehicles in the database
 *   pnpm --filter @prismgo/api gps:check --imei 3584…,3520… --vehicle GJ01KT0057,GJ18BT5684
 *   add --raw to print the first row exactly as the vendor sent it
 */
import { db, flags } from './lib';
import { toGpsPoint, TrakzeeClient, type TrakzeeVehicle } from '../src/tracking/vendor/trakzee';

const env = (key: string, fallback = '') => process.env[key]?.trim() || fallback;

async function main() {
  const f = flags();
  const missing = ['GPS_VENDOR_BASE_URL', 'GPS_VENDOR_USERNAME', 'GPS_VENDOR_PASSWORD'].filter(
    (k) => !env(k),
  );
  if (missing.length) {
    throw new Error(
      `Missing (apps/api/.env, or infra/.env.prod on the server): ${missing.join(', ')}`,
    );
  }
  const timeZone = env('GPS_VENDOR_TIME_ZONE', '+05:30');
  const client = new TrakzeeClient({
    baseUrl: env('GPS_VENDOR_BASE_URL'),
    username: env('GPS_VENDOR_USERNAME'),
    password: env('GPS_VENDOR_PASSWORD'),
    projectId: env('GPS_VENDOR_PROJECT_ID', '37'),
    company: env('GPS_VENDOR_COMPANY'),
    timeZone,
  });

  const prisma = db();
  const known = await prisma.vehicle.findMany({
    where: { gpsDeviceId: { not: null } },
    select: { regNo: true, gpsDeviceId: true },
  });
  await prisma.$disconnect();
  const byImei = new Map(known.map((v) => [v.gpsDeviceId!, v.regNo]));

  let vehicles: TrakzeeVehicle[];
  if (typeof f['imei'] === 'string') {
    const imeis = f['imei'].split(',');
    const regs = typeof f['vehicle'] === 'string' ? f['vehicle'].split(',') : [];
    vehicles = imeis.map((imei, i) => ({ imei: imei.trim(), regNo: regs[i]?.trim() ?? '' }));
  } else {
    vehicles = known.map((v) => ({ regNo: v.regNo, imei: v.gpsDeviceId! }));
  }
  if (vehicles.length === 0) {
    throw new Error('No vehicles with a GPS device id. Add them, or pass --imei and --vehicle.');
  }

  const started = Date.now();
  const rows = await client.live(vehicles);
  console.log(`Vendor answered in ${Date.now() - started} ms with ${rows.length} row(s).\n`);
  if (f['raw'] && rows[0])
    console.log('First row as sent:', JSON.stringify(rows[0], null, 2), '\n');

  const table = rows.map((row) => {
    const p = toGpsPoint(row, timeZone);
    const imei = String(row['Imeino'] ?? '');
    const ageMin = p ? Math.round((Date.now() - Date.parse(p.recordedAt)) / 60_000) : null;
    return {
      vehicle: String(row['Vehicle_No'] ?? ''),
      imei,
      'in PrismGo': byImei.get(imei) ?? '—',
      status: String(row['Status'] ?? ''),
      'fix (IST)': String(row['GPSActualTime'] ?? ''),
      'age min': ageMin ?? '—',
      position: p ? `${p.lat.toFixed(5)}, ${p.lng.toFixed(5)}` : 'no usable fix',
      speed: p?.speedKmh ?? '—',
      odometer: String(row['Odometer'] ?? ''),
    };
  });
  console.table(table);
  const unmatched = vehicles.filter((v) => !rows.some((r) => String(r['Imeino']) === v.imei));
  if (unmatched.length) {
    console.log(
      `\nNo row for: ${unmatched.map((v) => `${v.regNo || '?'} (${v.imei})`).join(', ')}`,
    );
  }
}

main().catch((err: Error) => {
  console.error(err.message);
  process.exit(1);
});
