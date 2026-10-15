# Deploying PrismGo

One Linux server runs everything with Docker Compose:

```
Internet ──443──▶ web (Caddy: HTTPS, web app, /api proxy)
                    └──▶ api ×2 (NestJS; migrations run on start)
                           ├──▶ postgres (PostGIS)   ─ volume pgdata
                           └──▶ redis                 ─ volume redisdata
```

Only ports 80 and 443 are published. Caddy gets and renews the Let's Encrypt certificate on its own.

## 1. Server

- Ubuntu 24.04 LTS, 2 vCPU, 4 GB RAM, 40 GB SSD is enough for the MVP.
- A DNS **A record** for the domain (e.g. `prismgo.client.in`) pointing to the server's public IP.
- Inbound ports 22, 80, 443 open (also in any cloud firewall / security group).

```bash
sudo apt update && sudo apt -y upgrade
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER        # log out and back in
sudo ufw allow OpenSSH && sudo ufw allow 80 && sudo ufw allow 443 && sudo ufw enable
```

## 2. Code and settings

```bash
sudo mkdir -p /opt/prismgo && sudo chown $USER /opt/prismgo
git clone https://github.com/BlackPrism-in/PrismGo.git /opt/prismgo
cd /opt/prismgo
cp infra/.env.prod.example infra/.env.prod
chmod 600 infra/.env.prod
```

Fill in `infra/.env.prod`. Make each secret with `openssl rand -hex 32`. Production refuses to start with a missing or placeholder secret.

The commands below assume this alias:

```bash
echo "alias prod='docker compose -f /opt/prismgo/infra/docker-compose.prod.yml --env-file /opt/prismgo/infra/.env.prod'" >> ~/.bashrc && source ~/.bashrc
```

### Before WhatsApp templates are approved (UAT)

Set `APP_ENV=staging`, `OTP_CHANNELS=console`, `MESSAGING_PROVIDER=console`. Notifications and login codes are then only logged: `prod logs api | grep -E "WhatsApp|OTP"`.

For a supervised UAT session only, `OTP_EXPOSE_CODE=true` shows the login code on the login screen. **Anyone who can reach the site can then log in as any registered number.** Turn it off right after the session (`prod up -d` applies the change).

Go-live settings: `APP_ENV=production`, `OTP_CHANNELS=whatsapp`, `MESSAGING_PROVIDER=whatsapp`, `OTP_EXPOSE_CODE=false`, WhatsApp keys filled in. Production refuses the console senders.

## 3. Start

```bash
prod up -d --build
prod ps                                    # api ×2 healthy, postgres, redis, web
curl https://<domain>/api/v1/health        # {"status":"ok","db":"up","redis":"up"}
```

The first start takes a few minutes (image build, certificate). If HTTPS fails, check `prod logs web`: DNS not yet pointing at the server or port 80 blocked are the usual causes.

## 4. First organisation and master data

Create the organisation and its first super admin (they log in with this phone):

```bash
prod exec api npx tsx scripts/bootstrap.ts --org "<Client name>" --admin-name "<Name>" --admin-phone <10-digit mobile>
```

Load departments, users, vehicles and drivers from the CSV templates in [master-data-templates](master-data-templates/README.md). Copy the filled CSVs to the server (e.g. `/opt/prismgo-data`), check them, then apply:

```bash
prod run --rm -v /opt/prismgo-data:/data:ro api npx tsx scripts/import-master-data.ts --dir /data           # dry run
prod run --rm -v /opt/prismgo-data:/data:ro api npx tsx scripts/import-master-data.ts --dir /data --apply
```

The import checks every row before writing anything and can be re-run safely.

## 5. GPS vendor

The vendor (Trakzee) offers a pull API, which PrismGo polls every 15 seconds (see [gps-integration.md](gps-integration.md)). In `infra/.env.prod` set `GPS_PULL_PROVIDER=trakzee` and the `GPS_VENDOR_*` username, password, project id and company name.

Each vehicle's **GPS device id** in the admin screen must be its tracker's IMEI, as the vendor lists it. Check the connection and matching from the server:

```bash
prod exec api npx tsx scripts/gps-check.ts
```

Vehicles that show `—` under "in PrismGo" have an IMEI that matches no vehicle: fix the GPS device id on the Vehicles page. The webhook (`https://<domain>/api/v1/gps/webhook` with header `X-GPS-Secret`) stays available for the simulator or a vendor that pushes.

## 6. Mobile app

Build against the server's address:

```bash
cd apps/mobile
flutter build apk --release --split-per-abi --dart-define=API_ORIGIN=https://<domain>
```

Share `build/app/outputs/flutter-apk/app-arm64-v8a-release.apk`. iOS testers: TestFlight build with the same `--dart-define` (needs the Apple developer account).

## 7. Backups

Nightly database dump, kept 14 days. Optionally copied off the server with rclone (`BACKUP_REMOTE`, e.g. `b2:prismgo-backups`).

```bash
sudo crontab -e
# 30 2 * * * /opt/prismgo/infra/backup.sh >> /var/log/prismgo-backup.log 2>&1
sudo /opt/prismgo/infra/backup.sh          # run once now and check it works
```

Restore (replaces all current data):

```bash
prod stop api
sudo /opt/prismgo/infra/restore.sh /var/backups/prismgo/prismgo-YYYYMMDD-HHMMSS.dump   # type RESTORE
prod up -d api
```

Test a restore once before go-live. A backup kept only on the same server is not a backup: set `BACKUP_REMOTE`.

## 8. Monitoring

- Uptime check (UptimeRobot, Better Stack, etc.) on `https://<domain>/api/v1/health` every minute. It returns 503 when the database or Redis is down.
- Logs: `prod logs -f api`, `prod logs -f web`. Docker keeps them per container.
- Disk: `df -h` and `docker system df` now and then. Location history grows by about 1 row per vehicle per 10–30 s.

## 9. Updates and rollback

```bash
cd /opt/prismgo
git fetch --tags && git checkout v0.1.1     # the release to deploy
prod up -d --build
```

Migrations run when the API starts. Requests during the restart wait (Caddy retries for up to 15 s) instead of failing.

Rollback: `git checkout <previous tag> && prod up -d --build`. Migrations are additive. If a release changed the database in a way the old version can't read, restore the backup taken before the update. Run `infra/backup.sh` before every update.

## Settings reference

| Variable                                                                                                           | Purpose                                                                         |
| ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------- |
| `DOMAIN`                                                                                                           | Public domain; HTTPS certificate and allowed web origin                         |
| `APP_ENV`                                                                                                          | `production`, or `staging` for UAT (allows console senders)                     |
| `POSTGRES_PASSWORD`, `REDIS_PASSWORD`                                                                              | Internal service passwords                                                      |
| `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`                                                                          | Sign login sessions; changing them logs everyone out                            |
| `GPS_WEBHOOK_SECRET`                                                                                               | Webhook secret (simulator, or a vendor that pushes)                             |
| `GPS_PULL_PROVIDER`, `GPS_PULL_INTERVAL_S`                                                                         | `trakzee` to poll the vendor; seconds between polls (15)                        |
| `GPS_VENDOR_BASE_URL`, `GPS_VENDOR_USERNAME`, `GPS_VENDOR_PASSWORD`, `GPS_VENDOR_PROJECT_ID`, `GPS_VENDOR_COMPANY` | Vendor API access                                                               |
| `OTP_CHANNELS`                                                                                                     | `whatsapp` (`console` in staging)                                               |
| `OTP_EXPOSE_CODE`                                                                                                  | Staging UAT only: show the login code on screen                                 |
| `MESSAGING_PROVIDER`                                                                                               | `whatsapp` (`console` in staging)                                               |
| `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_ACCESS_TOKEN`                                                                | WhatsApp Cloud API; templates in [whatsapp-templates.md](whatsapp-templates.md) |
| `VITE_GOOGLE_MAPS_API_KEY`                                                                                         | Browser key restricted to the domain; applied at build (`--build`)              |
