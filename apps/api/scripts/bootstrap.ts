/**
 * First-time setup of a production database: the client organisation and its
 * first super admin (who then logs in by phone and manages everything else).
 *
 *   npx tsx scripts/bootstrap.ts --org "Acme Pvt Ltd" --admin-name "Asha Rao" --admin-phone 98xxxxxxxx
 */
import { normalizeIndianMobile } from '@prismgo/shared';
import { db, flags } from './lib';

async function main() {
  const f = flags();
  const orgName = typeof f['org'] === 'string' ? f['org'].trim() : '';
  const adminName = typeof f['admin-name'] === 'string' ? f['admin-name'].trim() : '';
  const phone =
    typeof f['admin-phone'] === 'string' ? normalizeIndianMobile(f['admin-phone']) : null;
  if (!orgName || !adminName || !phone) {
    throw new Error(
      'Usage: --org "Name" --admin-name "Name" --admin-phone 98xxxxxxxx (valid Indian mobile)',
    );
  }

  const prisma = db();
  try {
    const existing = await prisma.organisation.findMany();
    if (existing.length > 1)
      throw new Error('More than one organisation exists; bootstrap is for a fresh database');
    const org =
      existing[0] ??
      (await prisma.organisation.create({
        data: { name: orgName, settings: { approvalSlaHours: 4, geofenceRadiusM: 150 } },
      }));
    if (existing[0] && existing[0].name !== orgName) {
      console.log(`Organisation already exists as "${existing[0].name}"; keeping it.`);
    }

    const admin = await prisma.user.upsert({
      where: { phone },
      update: { status: 'active', roles: { set: ['super_admin'] } },
      create: { orgId: org.id, name: adminName, phone, roles: ['super_admin'] },
    });
    console.log(`Organisation: ${org.name} (${org.id})`);
    console.log(
      `Super admin: ${admin.name}, ${admin.phone}. They can now log in with their phone.`,
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e: Error) => {
  console.error(e.message);
  process.exit(1);
});
