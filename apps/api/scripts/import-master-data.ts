/**
 * Loads the client's master data from CSV files (templates in docs/master-data-templates).
 * Dry run by default: prints what would change. Add --apply to write.
 * Safe to re-run: rows are matched on department name, phone, reg no and licence no.
 *
 *   npx tsx scripts/import-master-data.ts --dir ./client-data          # preview
 *   npx tsx scripts/import-master-data.ts --dir ./client-data --apply  # write
 *
 * Files (any may be missing): departments.csv, users.csv, vehicles.csv, drivers.csv
 */
import { normalizeIndianMobile, ROLES, type Role } from '@prismgo/shared';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { db, flags, parseCsv } from './lib';

type Row = Record<string, string>;
const problems: string[] = [];
const plan: string[] = [];

function read(dir: string, file: string): Row[] {
  const path = join(dir, file);
  if (!existsSync(path)) return [];
  return parseCsv(readFileSync(path, 'utf8'));
}

function phoneOf(raw: string, where: string): string | null {
  const p = normalizeIndianMobile(raw);
  if (!p) problems.push(`${where}: "${raw}" is not a valid Indian mobile number`);
  return p;
}

async function main() {
  const f = flags();
  const dir = typeof f['dir'] === 'string' ? f['dir'] : '';
  const apply = f['apply'] === true;
  if (!dir || !existsSync(dir)) throw new Error('Usage: --dir <folder with CSV files> [--apply]');

  const prisma = db();
  try {
    const orgs = await prisma.organisation.findMany();
    if (orgs.length !== 1)
      throw new Error('Expected exactly one organisation. Run scripts/bootstrap.ts first.');
    const org = orgs[0]!;

    const departments = read(dir, 'departments.csv');
    const users = read(dir, 'users.csv');
    const vehicles = read(dir, 'vehicles.csv');
    const drivers = read(dir, 'drivers.csv');

    // ── Validate everything first, so nothing is half-imported. ──
    const deptNames = new Set(
      (await prisma.department.findMany({ where: { orgId: org.id } })).map((d) =>
        d.name.toLowerCase(),
      ),
    );
    departments.forEach((d, i) => {
      if (!d['name']) problems.push(`departments.csv row ${i + 2}: name is required`);
      else deptNames.add(d['name'].toLowerCase());
    });

    const userRows = users.map((u, i) => {
      const where = `users.csv row ${i + 2}`;
      const roles = (u['roles'] || 'requester')
        .split(/[;|]/)
        .map((r) => r.trim().toLowerCase().replace(/\s+/g, '_'))
        .filter(Boolean);
      const bad = roles.filter((r) => !(ROLES as readonly string[]).includes(r));
      if (!u['name']) problems.push(`${where}: name is required`);
      if (bad.length)
        problems.push(`${where}: unknown role(s) ${bad.join(', ')} (use ${ROLES.join(', ')})`);
      if (u['department'] && !deptNames.has(u['department'].toLowerCase())) {
        problems.push(
          `${where}: department "${u['department']}" is not in departments.csv or the database`,
        );
      }
      return { raw: u, phone: phoneOf(u['phone'] ?? '', where), roles: roles as Role[] };
    });
    const seenPhones = new Set<string>();
    userRows.forEach((u, i) => {
      if (u.phone && seenPhones.has(u.phone))
        problems.push(`users.csv row ${i + 2}: duplicate phone ${u.phone}`);
      if (u.phone) seenPhones.add(u.phone);
    });

    departments.forEach((d, i) => {
      if (!d['hod_phone']) return;
      const p = phoneOf(d['hod_phone'], `departments.csv row ${i + 2} (hod_phone)`);
      const hod = userRows.find((u) => u.phone === p);
      if (p && hod && !hod.roles.includes('hod')) {
        problems.push(`departments.csv row ${i + 2}: HOD ${p} must have the hod role in users.csv`);
      }
    });

    const vehicleRegs = new Set<string>();
    const vehicleRows = vehicles.map((v, i) => {
      const where = `vehicles.csv row ${i + 2}`;
      const regNo = (v['reg_no'] ?? '').replace(/[\s-]/g, '').toUpperCase();
      const seats = Number(v['seats']);
      if (!regNo) problems.push(`${where}: reg_no is required`);
      if (!v['type']) problems.push(`${where}: type is required`);
      if (!Number.isInteger(seats) || seats < 1 || seats > 60)
        problems.push(`${where}: seats must be 1–60`);
      vehicleRegs.add(regNo);
      return { raw: v, regNo, seats };
    });

    const driverRows = drivers.map((d, i) => {
      const where = `drivers.csv row ${i + 2}`;
      if (!d['name']) problems.push(`${where}: name is required`);
      if (!d['licence_no']) problems.push(`${where}: licence_no is required`);
      if (d['licence_expiry'] && !/^\d{4}-\d{2}-\d{2}$/.test(d['licence_expiry'])) {
        problems.push(`${where}: licence_expiry must be YYYY-MM-DD`);
      }
      const reg = (d['default_vehicle'] ?? '').replace(/[\s-]/g, '').toUpperCase();
      return { raw: d, phone: phoneOf(d['phone'] ?? '', where), defaultReg: reg || null };
    });

    if (problems.length) {
      console.error(
        `Found ${problems.length} problem(s); nothing was imported:\n- ${problems.join('\n- ')}`,
      );
      process.exit(1);
    }

    // ── Plan / apply ──
    const run = async <T>(label: string, fn: () => Promise<T>) => {
      plan.push(label);
      if (apply) await fn();
    };

    const deptId = new Map<string, string>();
    for (const d of await prisma.department.findMany({ where: { orgId: org.id } }))
      deptId.set(d.name.toLowerCase(), d.id);

    for (const d of departments) {
      await run(`department ${d['name']}`, async () => {
        const row = await prisma.department.upsert({
          where: { orgId_name: { orgId: org.id, name: d['name']! } },
          update: { costCentre: d['cost_centre'] || null },
          create: { orgId: org.id, name: d['name']!, costCentre: d['cost_centre'] || null },
        });
        deptId.set(row.name.toLowerCase(), row.id);
      });
    }

    for (const u of userRows) {
      await run(`user ${u.raw['name']} ${u.phone} [${u.roles.join(', ')}]`, async () => {
        const dept = u.raw['department'];
        const departmentId = dept ? (deptId.get(dept.toLowerCase()) ?? null) : null;
        await prisma.user.upsert({
          where: { phone: u.phone! },
          update: {
            name: u.raw['name']!,
            email: u.raw['email'] || null,
            roles: { set: u.roles },
            departmentId,
          },
          create: {
            orgId: org.id,
            name: u.raw['name']!,
            phone: u.phone!,
            email: u.raw['email'] || null,
            roles: u.roles,
            departmentId,
          },
        });
      });
    }

    for (const d of departments.filter((x) => x['hod_phone'])) {
      const p = normalizeIndianMobile(d['hod_phone']!)!;
      await run(`HOD of ${d['name']} → ${p}`, async () => {
        const hod = await prisma.user.findUniqueOrThrow({ where: { phone: p } });
        await prisma.department.update({
          where: { id: deptId.get(d['name']!.toLowerCase())! },
          data: { hodUserId: hod.id },
        });
      });
    }

    const vehicleId = new Map<string, string>();
    for (const v of await prisma.vehicle.findMany({ where: { orgId: org.id } }))
      vehicleId.set(v.regNo, v.id);
    for (const v of vehicleRows) {
      await run(
        `vehicle ${v.regNo} (${v.raw['type']}, ${v.seats} seats, GPS ${v.raw['gps_device_id'] || '—'})`,
        async () => {
          const data = {
            type: v.raw['type']!,
            make: v.raw['make'] || null,
            model: v.raw['model'] || null,
            seats: v.seats,
            gpsDeviceId: v.raw['gps_device_id'] || null,
          };
          const row = await prisma.vehicle.upsert({
            where: { orgId_regNo: { orgId: org.id, regNo: v.regNo } },
            update: data,
            create: { orgId: org.id, regNo: v.regNo, ...data },
          });
          vehicleId.set(row.regNo, row.id);
        },
      );
    }

    for (const d of driverRows) {
      const licenceNo = d.raw['licence_no']!.replace(/\s/g, '').toUpperCase();
      await run(`driver ${d.raw['name']} ${d.phone} (${licenceNo})`, async () => {
        if (d.defaultReg && !vehicleId.has(d.defaultReg)) {
          throw new Error(`Driver ${d.raw['name']}: default_vehicle ${d.defaultReg} not found`);
        }
        const data = {
          name: d.raw['name']!,
          phone: d.phone!,
          licenceExpiry: d.raw['licence_expiry']
            ? new Date(`${d.raw['licence_expiry']}T00:00:00Z`)
            : null,
          defaultVehicleId: d.defaultReg ? vehicleId.get(d.defaultReg)! : null,
        };
        await prisma.driver.upsert({
          where: { orgId_licenceNo: { orgId: org.id, licenceNo } },
          update: data,
          create: { orgId: org.id, licenceNo, ...data },
        });
      });
    }

    console.log(
      `${apply ? 'Imported' : 'Would import'} ${plan.length} item(s) into "${org.name}":`,
    );
    for (const p of plan) console.log(`  · ${p}`);
    if (!apply) console.log('\nDry run only. Re-run with --apply to write.');
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e: Error) => {
  console.error(e.message);
  process.exit(1);
});
