# PrismGo

Fleet request and live tracking: employees request vehicles, HODs approve, the transport manager assigns a vehicle and driver and tracks every trip live.

| Path              | What                                                     |
| ----------------- | -------------------------------------------------------- |
| `apps/api`        | NestJS API, Prisma + PostgreSQL/PostGIS, Redis           |
| `apps/web`        | React web app (transport manager, admin, all roles)      |
| `apps/mobile`     | Flutter app (requester, HOD)                             |
| `packages/shared` | Roles, statuses and request workflow shared by api + web |
| `infra`           | Docker Compose for local Postgres and Redis              |

MVP plan: [docs/MVP-PHASES.md](docs/MVP-PHASES.md) — go-live 21 Oct 2026.

## Prerequisites

- Node 22 (`nvm use`), pnpm 10
- Docker Desktop
- Flutter 3.41 (for `apps/mobile`)

## First run

```bash
pnpm install
cp apps/api/.env.example apps/api/.env
pnpm db:up          # Postgres on :5433, Redis on :6380
pnpm db:migrate
pnpm db:seed
pnpm dev            # API on :4000, web on :5173
```

- Web: http://localhost:5173
- API health: http://localhost:4000/api/v1/health
- API docs: http://localhost:4000/api/v1/docs

Seeded users log in by phone: `9000000001` super admin, `…02` transport manager, `…03` / `…04` HODs, `…05` / `…06` requesters. With `OTP_CHANNELS=console` (the dev default) the code is printed in the API log and shown on the login screen; it is never shown in production.

### GPS simulator

Drives a vehicle through the real GPS webhook so the live map and automatic trip start/end can be seen without the vendor's trackers:

```bash
pnpm --filter @prismgo/api sim demo        # books a trip for the seeded requester, approves, assigns, drives it
pnpm --filter @prismgo/api sim PG-1001     # drives the vehicle already assigned to PG-1001
```

Options: `--every 2` (seconds between points), `--step 250` (metres per point). Webhook format: [docs/gps-integration.md](docs/gps-integration.md).

### Mobile

```bash
cd apps/mobile
flutter pub get
flutter run                     # emulator/simulator reaches the local API automatically
flutter run --dart-define=API_ORIGIN=https://<host>   # any other API server
```

If the repo sits in an iCloud-synced folder (e.g. `~/Desktop`), iOS code signing fails with "resource fork, Finder information, or similar detritus not allowed". Keep Flutter's build output outside iCloud:

```bash
rm -rf build && mkdir -p ~/Library/Caches/PrismGo/mobile-build && ln -s ~/Library/Caches/PrismGo/mobile-build build
```

App icon: `python3 tool/make_icon.py && dart run flutter_launcher_icons` (from `apps/mobile`).

Release APK for testers:

```bash
flutter build apk --release --split-per-abi --dart-define=API_ORIGIN=https://<api host>
```

### API clients

The API spec drives both clients. After changing an API endpoint or DTO:

```bash
pnpm --filter @prismgo/api openapi     # writes apps/api/openapi.json
pnpm --filter @prismgo/web api:types   # web: src/lib/api-schema.d.ts
apps/mobile/tool/generate_api.sh       # mobile: packages/prismgo_api (needs Java 11+)
```

## Deploy

Production runs on one server with Docker Compose (Caddy for HTTPS → API ×2 → PostgreSQL + Redis). Setup, backups, updates and rollback are in [docs/deployment.md](docs/deployment.md). The client acceptance test is [docs/uat-script.md](docs/uat-script.md).

```bash
docker compose -f infra/docker-compose.prod.yml --env-file infra/.env.prod up -d --build
```

## Checks

```bash
pnpm format:check && pnpm lint && pnpm typecheck && pnpm test && pnpm build
pnpm --filter @prismgo/api test:e2e   # needs pnpm db:up; uses its own prismgo_test database
cd apps/mobile && flutter analyze && flutter test
```
