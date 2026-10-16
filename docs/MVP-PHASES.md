# PrismGo MVP — Phases

Go-live: **Wed 21 Oct 2026**. Plan starts Wed 14 Oct 2026.

Full system design: [PrismGo — Fleet Request & Tracking: System Design](https://claude.ai/code/artifact/27358f3e-0cd3-4647-b93e-587d24a4bf5d)

## Scope recap

| App        | Users                                                 | Stack                                                               |
| ---------- | ----------------------------------------------------- | ------------------------------------------------------------------- |
| Web app    | Transport Manager, Super Admin (all roles can use it) | React + Vite + TypeScript, Tailwind, TanStack Query, Google Maps JS |
| Mobile app | Requester, HOD                                        | Flutter (Dart), Riverpod, Dio, go_router, google_maps_flutter, FCM  |
| API        | —                                                     | NestJS, PostgreSQL + PostGIS, Prisma, Redis + BullMQ, Socket.IO     |

Decisions already made:

- Login by phone number + OTP (WhatsApp, SMS fallback). No passwords.
- Approval is HOD only (one level).
- Drivers have no login. Trips start and end automatically from GPS tracker data; the Transport Manager can override.
- Location comes from the GPS trackers already fitted, through the vendor's API.
- Notifications on WhatsApp (plus push on mobile, in-app on web).
- Google Maps. Hosted on our server.
- Fleet at launch: minimum 2 vehicles.

## Repository layout

```
PrismGo/
├── apps/
│   ├── api/        NestJS backend (REST + Socket.IO), Prisma schema, workers
│   ├── web/        React web app
│   └── mobile/     Flutter app (requester, HOD)
├── packages/
│   └── shared/     TS types, zod schemas, constants shared by api + web
├── infra/          docker-compose, nginx, backup scripts
└── docs/           design notes, this plan
```

The Flutter app gets its API client generated from the API's OpenAPI spec (`apps/api` → `openapi.json` → Dart client).

## Timeline

| Phase | Dates               | Focus                                          |
| ----- | ------------------- | ---------------------------------------------- |
| 0     | Wed 14 Oct          | Setup and client access                        |
| 1     | Thu 15 Oct          | Login, roles, master data                      |
| 2     | Fri 16 – Sat 17 Oct | Request → approve → assign, notifications      |
| 3     | Fri 16 – Tue 20 Oct | Flutter mobile app (in parallel)               |
| 4     | Sun 18 – Mon 19 Oct | GPS integration, live map, auto trip start/end |
| 5     | Tue 20 Oct          | Deploy to our server, UAT with client          |
| 6     | Wed 21 Oct          | Go-live and handover                           |

---

## Phase 0 — Setup and client access (Wed 14 Oct)

**Goal:** everyone can run the stack locally, and every external account is requested today.

Engineering

- [x] Monorepo: pnpm workspace + Turborepo (`apps/api`, `apps/web`, `packages/shared`), Flutter project in `apps/mobile`
- [x] Lint, format, TypeScript strict, `.editorconfig`, `.env.example` per app
- [x] `infra/docker-compose.yml`: Postgres 16 + PostGIS, Redis (host ports 5433 / 6380 to avoid local installs)
- [x] Prisma schema v1: organisations, departments, users, vehicles, drivers, trip_requests, approvals, trips, location_points, trip_events, notifications, audit_log, plus otp_codes, refresh_tokens, device_tokens
- [x] Double-booking blocked in the database (exclusion constraints on vehicle and driver time windows)
- [x] Seed script: 1 org, 2 departments, sample users per role, 2 vehicles, 2 drivers
- [x] GitHub Actions: format, lint, typecheck, test, build, API e2e against Postgres + Redis; `flutter analyze` + `flutter test`

Notes from Phase 0

- `location_points` is a plain table for now. Monthly partitioning is added when volume needs it (Prisma Migrate treats partitions as drift).
- Pickup/drop are stored as lat/lng numbers; geofence checks run in code. PostGIS is enabled for later geo queries.
- NestJS 12 is ESM-only, so API tests run on Vitest + SWC rather than Jest.
- Prisma is pinned to 7.10.0 (npm `latest` currently points at an 8.0 release candidate).

Client inputs (request today, needed by 15 Oct)

- [ ] GPS vendor: API docs, credentials, device IDs for each vehicle
- [ ] Meta Business verification + WhatsApp Business number; draft templates submitted
- [ ] Google Cloud project with billing; Maps JS, Places, Directions, Android/iOS Maps SDK keys
- [ ] SMS gateway account + DLT sender ID and OTP template registration
- [ ] Apple Developer and Google Play **organisation** accounts
- [ ] Firebase project (FCM) for push
- [ ] Master data: departments, HOD per department, employees (name, phone), vehicles, drivers

**Done when:** `docker compose up` + `pnpm dev` runs api and web; `flutter run` opens the mobile shell; DB migrates and seeds. ✅ Engineering done 14 Oct; client inputs pending.

---

## Phase 1 — Login, roles, master data (Thu 15 Oct) ✅ done 14 Oct

**Goal:** a seeded user can log in with their phone and see screens for their role.

API

- [x] `POST /auth/otp/request`, `/otp/verify`, `/refresh`, `/logout`, `GET /auth/me`; 6-digit code stored as HMAC, 5-min expiry, 5 attempts, 3 codes per number per 10 min, plus per-IP rate limits
- [x] Unknown numbers get the same "sent" answer (no way to probe who is registered)
- [x] OTP delivery chain set by `OTP_CHANNELS`: WhatsApp Cloud API sender, console sender for dev (refused in production). SMS sender added when the gateway account and DLT template exist
- [x] JWT access (15 min) + rotating refresh tokens (30 days); reusing an old refresh token revokes all of that user's sessions
- [x] Web gets the refresh token as an httpOnly cookie (`X-Client: web`); mobile keeps it in secure storage
- [x] RBAC guard (requester, hod, transport_manager, super_admin) + org scoping on every query
- [x] CRUD: departments (list for everyone), users, vehicles, drivers (manager / super admin only); phone and reg-no normalisation; 409 on duplicates
- [x] HOD rules: only users with the HOD role can head a department; losing the role or being deactivated clears it; deactivation ends sessions
- [x] Audit log written in the same transaction as each change
- [x] OpenAPI spec at `/api/v1/docs`, exported to `apps/api/openapi.json`

Web

- [x] Phone + OTP login, silent session restore and refresh, role-based routing and nav
- [x] Master data screens: departments (with HOD), users (search + filters, roles, status), vehicles (GPS device link), drivers (licence expiry warnings)
- [x] Types generated from the API spec (`pnpm --filter @prismgo/web api:types`)

Mobile

- [x] Dart API client generated from OpenAPI into `packages/prismgo_api` (`tool/generate_api.sh`)
- [x] Phone + OTP login, secure token storage, refresh-and-retry interceptor, role-aware home, logout

Tests: API e2e 16 (own `prismgo_test` database), web 12, mobile 10, shared 14.

**Done when:** each seeded role logs in on web (and requester/HOD on mobile) and sees only what they're allowed to. ✅ Checked in the browser (transport manager) and on the iOS simulator (HOD).

---

## Phase 2 — Request, approval, assignment (Fri 16 – Sat 17 Oct) ✅ done 14 Oct

**Goal:** a request goes from submit to assigned, with everyone notified.

API

- [x] Request state machine: draft → pending_approval → approved / rejected → assigned → in_progress → completed / cancelled; invalid transitions return 409
- [x] Guarded status updates: two people acting at once (approve vs. cancel) can't both succeed
- [x] `POST /requests` (submit or draft), `GET /requests?scope=mine|approvals|all&status=`, `GET /requests/:id`, `PATCH /requests/:id`, `/submit`, `/cancel`
- [x] `POST /requests/:id/approve`, `/reject` (reason required); only the department's HOD, never on their own request
- [x] An HOD's own request is auto-approved and goes straight to transport
- [x] Department with no HOD: request waits and admins/transport are told
- [x] `GET /availability?from=&to=&passengers=`, `POST /requests/:id/assign`, `POST /trips/:id/reassign`; seat check; default booking window = return time or pickup + 2 h
- [x] Double-booking blocked by exclusion constraints on vehicle and driver time ranges (409 with a clear message)
- [x] Every request carries a timeline and the `actions` the signed-in user may take, so web and mobile don't duplicate permission rules
- [x] Notifications: in-app rows + socket push; WhatsApp through a BullMQ outbox with retries (console in dev). Templates listed in [whatsapp-templates.md](whatsapp-templates.md)
- [x] Socket.IO at `/api/v1/socket.io` with JWT auth; rooms `user:{id}` and `org:{id}:managers`; Redis adapter for multiple API instances
- [x] `GET /notifications`, `/unread-count`, `POST /notifications/:id/read`, `/read-all`
- [ ] FCM push to mobile → moved to Phase 3 (needs the Firebase project)
- [ ] "Trip started / completed" messages → Phase 4 (trip detector)

Web

- [x] Requester: new request / edit / draft, my requests, request detail with timeline, cancel
- [x] HOD: approvals page, approve / decline with comment
- [x] Manager: dispatch page (to assign, assigned, awaiting HOD), assign with live availability and usual-driver suggestion, change vehicle or driver
- [x] Notification bell with unread count; pages refresh live over the socket
- [ ] Google Places address search → as soon as the Maps key arrives (until then: address + coordinates, with recent places as shortcuts)

Tests: API e2e 25 (workflow, permissions, double-booking, race, sockets), web 20.

**Done when:** a full request runs requester → HOD → manager on web, with WhatsApp (or console provider) messages at each step. ✅ Checked in the browser with the three seeded users; console showed the WhatsApp message for each step, including the driver's trip details.

---

## Phase 3 — Flutter mobile app (Fri 16 – Tue 20 Oct, in parallel) — core done 14 Oct

**Goal:** requesters and HODs can do everything they need from their phone.

- [x] App shell: theme, go_router, Riverpod, bottom tabs by role (Home, Requests, Approvals for HODs, Alerts) with badges, error / empty / offline states
- [x] Requester: new request (address + coordinates with recent places, date/time pickers, people, purpose, notes), drafts, my requests (upcoming / past), detail with timeline, edit, cancel
- [x] HOD: approvals list with approve / decline (reason required) from the list or the detail screen
- [x] Trip card on the request: vehicle, driver name and phone with a Call button
- [x] Live updates over the socket (status, lists, alert badge) — checked: approving on the web updated the phone instantly
- [x] Alerts screen with unread state, mark read / mark all read, tap opens the request
- [x] App icon in the brand palette (`tool/make_icon.py`, placeholder until the client's logo), app name "PrismGo"
- [x] Android release APK builds (`flutter build apk --release --dart-define=API_ORIGIN=…`)
- [ ] Google Places autocomplete → when the Maps key arrives
- [ ] Live vehicle on a map + ETA → Phase 4 (needs GPS data and the Maps key)
- [ ] Push notifications (FCM / APNs) → needs the client's Firebase project; device tokens table is ready
- [ ] Release signing: Android upload keystore (currently debug-signed); iOS TestFlight needs the Apple Developer account

Tests: 17 widget/unit tests (login, roles/tabs, approvals, decline reason, detail actions, form validation, alerts, auth interceptor).

**Done when:** a requester creates a request and an HOD approves it on mobile, both get push, and the requester sees the live vehicle once the trip starts. ✅ Request + approval + live status checked on the iOS simulator; push and live map pending as above.

---

## Phase 4 — GPS integration and live map (Sun 18 – Mon 19 Oct) — core done 14 Oct

**Goal:** the manager sees every vehicle moving live, and trips open and close on their own.

API

- [x] GPS webhook `POST /gps/webhook` (shared-secret header), PrismGo point format documented in [gps-integration.md](gps-integration.md); device id → vehicle mapping
- [x] Points stored once per (vehicle, time); future / very old points and unknown devices reported back
- [x] Latest position per vehicle in Redis (keyed per database); pushed over the socket at most every 3 s per vehicle to managers and to the requester of the active trip
- [x] Trip detector: start on leaving the pickup geofence (150 m, org setting) within the hour before pickup; end at the drop, or back at pickup for round trips; distance from odometer, else from the GPS path
- [x] Manual start / end for transport managers (`POST /trips/:id/start|end`), shown as request actions
- [x] Vehicle status follows trips (on trip / available)
- [x] `GET /live/vehicles` and `GET /trips/:id/track` with ETA
- [x] GPS-lost watchdog every minute: one alert to transport when a running trip is quiet for 5 min
- [x] Notifications: trip started (requester), trip completed (requester + transport), GPS lost (transport); WhatsApp templates added
- [x] Simulator `pnpm --filter @prismgo/api sim demo | PG-xxxx` drives vehicles through the real webhook
- [ ] Vendor adapter (push mapping or polling worker) → when the vendor shares API access and docs
- [ ] Road route + ETA from Google Directions → when the Maps key arrives (now: straight line × 1.3 at ≥ 22 km/h)

Web

- [x] Live map page: all vehicles, status colours (on a trip / idle / no recent GPS), heading, list with trip, requester and ETA; click to focus
- [x] Trip map on the request: pickup, drop, driven path, live vehicle, ETA
- [x] Dispatch: "On the way" section; Start trip now / End trip buttons
- [ ] Google map tiles → when the key arrives (now OpenStreetMap via Leaflet)

Mobile

- [x] Trip map on the request detail (flutter_map): pickup, drop, driven path, live vehicle with heading, ETA, updated live over the socket

Tests: API e2e 32 (tracking: webhook auth, duplicates, auto start/end, round trip, manual override, live/track, socket push, GPS-lost), web 23, mobile 18.

Vendor API (16 Oct): the client's vendor (Trakzee) offers a token-based **pull** API, not a webhook. Built a poller (`GPS_PULL_PROVIDER=trakzee`, every 15 s, one replica at a time) that maps their rows into the same pipeline; tested with a fake vendor. `gps:check` script to verify the real connection and IMEI matching. Waiting on: a real run against the vendor, token lifetime, odometer unit, HTTPS endpoint.

Push API (16 Oct): Uffizio also supports push. Sent them the [PrismGo GPS Push API](PrismGo-GPS-Push-API.pdf) spec (endpoint `https://api.prismgo.blackprism.in/api/v1/gps/webhook`, `X-GPS-Secret` header, shared by phone). Plan: pull now, push once they send a test batch, run both for a day, then turn pull off.

**Done when:** with real (or simulated) tracker data, a trip starts and ends automatically and the map updates within 3 s. ✅ Simulated end to end on the dev server: PG-1003 and PG-1004 started on leaving pickup and completed at the drop, with the web live map following the vehicle.

---

## Phase 5 — Deploy and UAT (Tue 20 Oct) — demo live 16 Oct on Render + Vercel

**Goal:** the client tests the real system on our server.

- [x] Docker images for api and web; Compose stack: Caddy (HTTPS via Let's Encrypt, web app, `/api` proxy) → api ×2 → PostgreSQL + Redis. Caddy replaced Nginx: it handles certificates on its own. The outbox worker and GPS watchdog run inside the api replicas (BullMQ), so there is no separate worker container.
- [x] Migrations run when the api starts (one replica migrates, the other waits)
- [x] Production env file with secrets; production refuses placeholder secrets and console senders. `APP_ENV=staging` for UAT before WhatsApp approval, with optional on-screen login codes (`OTP_EXPOSE_CODE`)
- [x] Nightly `pg_dump`, kept 14 days, optional off-server copy (rclone); restore script. Backup and restore tested locally. WAL archiving deferred: nightly dumps are enough for the MVP's data volume
- [x] Health endpoint for the uptime check; restarting api replicas causes no failed requests (Caddy retries)
- [x] Bootstrap and master-data import run inside the container
- [x] [Deployment guide](deployment.md) and [UAT script](uat-script.md); the GPS simulator can drive trips on the UAT server until the vendor feed is live
- [x] Demo / UAT deployment (16 Oct): web app on Vercel at https://prismgo.blackprism.in, API + PostgreSQL + Redis on Render (free, Singapore) at https://api.prismgo.blackprism.in; DNS at Namecheap; both deploy on push to `main`. See [deployment.md](deployment.md#demo-on-render-free-plan)
- [ ] Uptime check on the API health URL (keeps the free Render service awake, so GPS polling runs)
- [ ] Load client master data (departments, users, vehicles with tracker IMEIs, drivers)
- [ ] WhatsApp live: Meta business verification submitted; app `PrismGo`, system user `prismgo-api` and token set up; 12 templates submitted 16 Oct, in review. When approved: switch `OTP_CHANNELS` / `MESSAGING_PROVIDER` to `whatsapp`, `OTP_EXPOSE_CODE=false`
- [ ] Production on the client's server before the free Render database expires (about 15 Nov): server, SSH access and domain; deploy with Compose; test restore
- [ ] Sentry on api, web and mobile (deferred; logs + uptime check for the MVP)
- [ ] UAT script run with the client: login, request, approve, assign, live trip, auto close, notifications
- [ ] Fix list from UAT triaged: blockers fixed same day

Notes from Phase 5

- Verified locally with the production stack (plain HTTP on port 8080): login with on-screen code, refresh cookie, live socket through Caddy, GPS webhook, a full simulated trip (booked → approved → assigned → auto start → auto complete) with every WhatsApp message sent from the queue, backup → restore, and replica restarts under load.
- Images: api about 1.5 GB (Prisma engines + tsx for the admin scripts), web 81 MB.
- Render demo: one Docker service where the API also serves the web app (`infra/render.Dockerfile`, `render.yaml`); the web app on Vercel calls it cross-origin (`VITE_API_ORIGIN`). Both hosts share `blackprism.in`, so the refresh cookie works. Behind proxies the API reads the client IP from `X-Forwarded-For` (`TRUST_PROXY`), so rate limits are per user.
- WhatsApp templates were reworded for Meta's rules (no variable at the start or end, enough words per variable); variable order unchanged, so no code change. Sender +91 70014 41439 is shared with PrismChat; replies to PrismGo messages reach PrismChat's webhook.

**Done when:** the client signs off the UAT script.

---

## Phase 6 — Go-live (Wed 21 Oct)

- [ ] Final deploy from `main` with a tagged release (`v0.1.0`)
- [ ] APK shared and TestFlight invites sent to requesters and HODs
- [ ] 30-minute walkthrough for the Transport Manager and HODs
- [ ] Handover note: URLs, admin accounts, support contact, known limits

---

## After go-live (phase 2 backlog)

- Reports and CSV export (utilisation, trips per department, km driven)
- SLA reminders; off-route and overspeed alerts
- Trip replay on the map
- GPS queue (Redis Stream) + batch worker as the fleet grows
- Play Store and App Store listing
- Onboarding more organisations

## Risks to the date

| Risk                                              | Needed by | Fallback                                                                                    |
| ------------------------------------------------- | --------- | ------------------------------------------------------------------------------------------- |
| WhatsApp verification / template approval is slow | 15 Oct    | Submitted 16 Oct. Until approved: on-screen codes (supervised UAT) and in-app notifications |
| GPS vendor access late                            | 15 Oct    | Pull API access received 16 Oct; simulator for UAT if the real feed isn't flowing           |
| Google Maps key with billing                      | 15 Oct    | None good — blocks address search and maps                                                  |
| SMS DLT registration slow                         | 15 Oct    | OTP over WhatsApp only                                                                      |
| Server, domain, HTTPS                             | 19 Oct    | Demo on Render + Vercel since 16 Oct; production server needed by about 15 Nov              |
