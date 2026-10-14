#!/bin/sh
# Applies pending database migrations, then starts the given command.
# Safe with several API containers: Prisma takes a database lock while migrating.
set -e
if [ "${SKIP_MIGRATIONS:-false}" != "true" ]; then
  npx prisma migrate deploy
fi
exec "$@"
