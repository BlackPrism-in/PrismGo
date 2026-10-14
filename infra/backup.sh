#!/usr/bin/env bash
# Nightly PostgreSQL backup for the production stack.
#   - pg_dump (custom format) into BACKUP_DIR, keeps the last KEEP_DAYS days
#   - optional off-server copy with rclone (BACKUP_REMOTE, e.g. "b2:prismgo-backups")
# Cron (as root), 02:30 IST daily:
#   30 2 * * * /opt/prismgo/infra/backup.sh >> /var/log/prismgo-backup.log 2>&1
set -euo pipefail

cd "$(dirname "$0")/.."
BACKUP_DIR="${BACKUP_DIR:-/var/backups/prismgo}"
KEEP_DAYS="${KEEP_DAYS:-14}"
COMPOSE=(docker compose -f infra/docker-compose.prod.yml --env-file "${ENV_FILE:-infra/.env.prod}")
STAMP="$(date +%Y%m%d-%H%M%S)"
FILE="$BACKUP_DIR/prismgo-$STAMP.dump"

mkdir -p "$BACKUP_DIR"
"${COMPOSE[@]}" exec -T postgres pg_dump -U prismgo -d prismgo --format=custom --no-owner > "$FILE.partial"
mv "$FILE.partial" "$FILE"
echo "$(date +%Y-%m-%dT%H:%M:%S%z) backup written: $FILE ($(du -h "$FILE" | cut -f1))"

find "$BACKUP_DIR" -name 'prismgo-*.dump' -mtime +"$KEEP_DAYS" -delete

if [[ -n "${BACKUP_REMOTE:-}" ]]; then
  rclone copy "$FILE" "$BACKUP_REMOTE/" && echo "$(date +%Y-%m-%dT%H:%M:%S%z) copied to $BACKUP_REMOTE"
fi
