#!/usr/bin/env bash
# Restores a backup made by backup.sh into the running production database.
# DESTRUCTIVE: replaces current data. Stop the API first:
#   docker compose -f infra/docker-compose.prod.yml --env-file infra/.env.prod stop api
#   infra/restore.sh /var/backups/prismgo/prismgo-YYYYMMDD-HHMMSS.dump
set -euo pipefail
cd "$(dirname "$0")/.."
DUMP="${1:?usage: restore.sh <file.dump>}"
read -r -p "Replace the production database with $DUMP? Type RESTORE to continue: " ok
[[ "$ok" == "RESTORE" ]] || { echo "Cancelled."; exit 1; }
docker compose -f infra/docker-compose.prod.yml --env-file "${ENV_FILE:-infra/.env.prod}" exec -T postgres \
  pg_restore -U prismgo -d prismgo --clean --if-exists --no-owner < "$DUMP"
echo "Restored. Start the API again with: docker compose ... up -d api"
