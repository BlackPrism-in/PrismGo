# GPS integration

PrismGo reads vehicle positions from the trackers already fitted in the fleet. The client's vendor (Trakzee) offers a **pull API**, so PrismGo polls it every 15 seconds. Positions from the poller, the webhook and the simulator all go through the same pipeline; everything after that (live map, ETA, automatic trip start and end, GPS-lost alerts) works the same whichever way they arrive.

## Ways in

| Option                                | When                               | What to build                                                                                 |
| ------------------------------------- | ---------------------------------- | --------------------------------------------------------------------------------------------- |
| **Vendor pushes to our webhook**      | The vendor can send HTTP callbacks | Nothing, if the vendor can send our format; otherwise a small adapter that maps their payload |
| **We poll the vendor's API** (in use) | The vendor only offers a pull API  | Built for Trakzee: `GPS_PULL_PROVIDER=trakzee` (below)                                        |
| **Simulator** (dev / demo)            | Before vendor access, or for demos | Already built: `pnpm --filter @prismgo/api sim demo`                                          |

## Trakzee pull API (the client's vendor)

From the vendor's "Token Based Pull API" document:

1. `POST {base}?token=generateAccessToken` with `{ username, password }` returns an access token.
2. `POST {base}?token=getTokenBaseLiveData&ProjectId=37` with header `auth-code: <token>` and body `{ company_names, vehicle_nos, imei_nos, format: "json" }` (lists are comma-separated) returns `{"root":{"VehicleData":[…]}}`, one row per vehicle.

How PrismGo uses it:

- A BullMQ job runs every `GPS_PULL_INTERVAL_S` seconds (default 15) on one API replica at a time. It asks for every active vehicle that has a GPS device id.
- The token is kept in memory and requested again whenever the vendor rejects it.
- Row mapping: `Imeino` → device id (must equal the vehicle's GPS device id in PrismGo); `Latitude`/`Longitude`; `GPSActualTime` (else `Datetime`) as `DD-MM-YYYY HH:mm:ss` in IST; `Speed` → km/h; `Angle` → heading; `IGN` ON/OFF → ignition. `--` means missing. Rows without a usable fix are skipped.
- Only fixes newer than the last one seen per device go into the pipeline. Rows for vehicles not in PrismGo are ignored.
- `Odometer` is not used until the vendor confirms its unit. Trip distance comes from the GPS path.
- If the vendor is unreachable, the error is logged once per outage. Running trips raise the usual "GPS signal lost" alert after 5 minutes.

Settings (API `.env` / `infra/.env.prod`): `GPS_PULL_PROVIDER=trakzee`, `GPS_PULL_INTERVAL_S`, `GPS_VENDOR_BASE_URL`, `GPS_VENDOR_USERNAME`, `GPS_VENDOR_PASSWORD`, `GPS_VENDOR_PROJECT_ID`, `GPS_VENDOR_COMPANY`, `GPS_VENDOR_TIME_ZONE` (default `+05:30`).

Check the connection without changing anything (uses the settings in `apps/api/.env`):

```bash
pnpm --filter @prismgo/api gps:check                 # vehicles in the database
pnpm --filter @prismgo/api gps:check --imei <imei1>,<imei2> --vehicle <reg1>,<reg2> --raw
```

It prints each row the vendor returns: vehicle, IMEI, whether it matches a PrismGo vehicle, fix time and age, position, speed and odometer.

Open questions for the vendor:

- Token lifetime, and how an expired token is reported.
- Recommended polling interval and rate limits.
- Time zone of `GPSActualTime` (assumed IST) and unit of `Odometer`.
- HTTPS endpoint: the documented URL is plain HTTP, so the password and token cross the internet unencrypted.
- History endpoint to back-fill gaps after an outage.

## Webhook

`POST https://<api host>/api/v1/gps/webhook`

Header: `X-GPS-Secret: <shared secret>` (`GPS_WEBHOOK_SECRET` on the server)

```json
{
  "points": [
    {
      "deviceId": "861234567890123",
      "recordedAt": "2026-10-20T04:12:05Z",
      "lat": 12.97561,
      "lng": 77.60662,
      "speedKmh": 32.5,
      "heading": 45,
      "ignition": true,
      "odometerKm": 18342.7
    }
  ]
}
```

- `deviceId` must match the **GPS device id** set on the vehicle (Vehicles page in the web app).
- `recordedAt` is the time the tracker took the fix, in UTC.
- `speedKmh`, `heading`, `ignition`, `odometerKm` are optional but improve ETA and trip distance.
- Up to 1000 points per call. Re-sending the same point is safe (stored once per vehicle and time).
- Points more than 2 minutes in the future or older than 7 days are rejected.

Response:

```json
{ "accepted": 1, "duplicates": 0, "rejected": 0, "unknownDevices": [] }
```

## What happens with each point

1. Stored in the trip history and kept as the vehicle's latest position.
2. Pushed live (at most every 3 seconds per vehicle) to transport managers, and to the requester whose trip the vehicle is on.
3. Trip detector:
   - **Start:** the vehicle was inside the pickup area (150 m, configurable) during the hour before pickup, then leaves it.
   - **End (one way):** the vehicle reaches the drop area.
   - **End (with return):** the vehicle reaches the drop, then comes back to the pickup.
   - Transport managers can always start or end a trip by hand.
4. If a running trip sends nothing for 5 minutes, transport managers get one alert.
