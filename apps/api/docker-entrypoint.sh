#!/bin/sh
# Applies pending database migrations, then starts the given command.
# Safe with several API containers: Prisma takes a database lock while migrating.
set -e
if [ "${SKIP_MIGRATIONS:-false}" != "true" ]; then
  npx prisma migrate deploy
fi
# Optional first-run setup where there is no shell (e.g. Render free): creates the
# organisation and first super admin if missing; safe to leave set.
if [ -n "${BOOTSTRAP_ADMIN_PHONE:-}" ]; then
  npx tsx scripts/bootstrap.ts --org "${BOOTSTRAP_ORG:?BOOTSTRAP_ORG is required}" \
    --admin-name "${BOOTSTRAP_ADMIN_NAME:?BOOTSTRAP_ADMIN_NAME is required}" \
    --admin-phone "$BOOTSTRAP_ADMIN_PHONE"
fi
exec "$@"
