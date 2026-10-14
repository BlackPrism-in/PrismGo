/**
 * Development seed: one organisation, two departments, a user per role,
 * two vehicles (with simulator GPS device ids) and two drivers.
 * Safe to re-run: every record is upserted on a unique key.
 *
 * Phone numbers are placeholders in the +91 90000 0000x range. Real client
 * master data is loaded separately in Phase 5.
 */
import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env['DATABASE_URL'] }),
});

const ORG_ID = '00000000-0000-4000-8000-000000000001';

async function main() {
  const org = await prisma.organisation.upsert({
    where: { id: ORG_ID },
    update: {},
    create: {
      id: ORG_ID,
      name: 'PrismGo Demo',
      settings: { approvalSlaHours: 4, geofenceRadiusM: 150 },
    },
  });

  const [ops, finance] = await Promise.all(
    ['Operations', 'Finance'].map((name) =>
      prisma.department.upsert({
        where: { orgId_name: { orgId: org.id, name } },
        update: {},
        create: { orgId: org.id, name },
      }),
    ),
  );

  const users = [
    { phone: '+919000000001', name: 'Asha Admin', roles: ['super_admin'], dept: null },
    { phone: '+919000000002', name: 'Tarun Transport', roles: ['transport_manager'], dept: ops },
    { phone: '+919000000003', name: 'Hema Ops HOD', roles: ['hod', 'requester'], dept: ops },
    {
      phone: '+919000000004',
      name: 'Farhan Finance HOD',
      roles: ['hod', 'requester'],
      dept: finance,
    },
    { phone: '+919000000005', name: 'Rahul Requester', roles: ['requester'], dept: ops },
    { phone: '+919000000006', name: 'Priya Requester', roles: ['requester'], dept: finance },
  ] as const;

  const byPhone: Record<string, { id: string }> = {};
  for (const u of users) {
    byPhone[u.phone] = await prisma.user.upsert({
      where: { phone: u.phone },
      update: { name: u.name, roles: [...u.roles], departmentId: u.dept?.id ?? null },
      create: {
        orgId: org.id,
        phone: u.phone,
        name: u.name,
        roles: [...u.roles],
        departmentId: u.dept?.id ?? null,
      },
    });
  }

  await prisma.department.update({
    where: { id: ops!.id },
    data: { hodUserId: byPhone['+919000000003']!.id },
  });
  await prisma.department.update({
    where: { id: finance!.id },
    data: { hodUserId: byPhone['+919000000004']!.id },
  });

  const vehicles = await Promise.all(
    [
      {
        regNo: 'KA01AB1001',
        type: 'Sedan',
        make: 'Maruti',
        model: 'Dzire',
        seats: 4,
        gpsDeviceId: 'SIM-001',
      },
      {
        regNo: 'KA01AB1002',
        type: 'SUV',
        make: 'Toyota',
        model: 'Innova',
        seats: 7,
        gpsDeviceId: 'SIM-002',
      },
    ].map((v) =>
      prisma.vehicle.upsert({
        where: { orgId_regNo: { orgId: org.id, regNo: v.regNo } },
        update: {},
        create: { orgId: org.id, ...v },
      }),
    ),
  );

  await Promise.all(
    [
      {
        name: 'Suresh Kumar',
        phone: '+919000000101',
        licenceNo: 'DL-SEED-0001',
        vehicle: vehicles[0],
      },
      {
        name: 'Manoj Singh',
        phone: '+919000000102',
        licenceNo: 'DL-SEED-0002',
        vehicle: vehicles[1],
      },
    ].map((d) =>
      prisma.driver.upsert({
        where: { orgId_licenceNo: { orgId: org.id, licenceNo: d.licenceNo } },
        update: {},
        create: {
          orgId: org.id,
          name: d.name,
          phone: d.phone,
          licenceNo: d.licenceNo,
          defaultVehicleId: d.vehicle!.id,
        },
      }),
    ),
  );

  console.log(
    `Seeded org "${org.name}": 2 departments, ${users.length} users, 2 vehicles, 2 drivers.`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
