# GPS integration

PrismGo reads vehicle positions from the trackers already fitted in the fleet. Positions arrive at one endpoint; everything after that (live map, ETA, automatic trip start and end, GPS-lost alerts) works the same whichever way they arrive.

## Ways in

| Option                                       | When                               | What to build                                                                                 |
| -------------------------------------------- | ---------------------------------- | --------------------------------------------------------------------------------------------- |
| **Vendor pushes to our webhook** (preferred) | The vendor can send HTTP callbacks | Nothing, if the vendor can send our format; otherwise a small adapter that maps their payload |
| **We poll the vendor's API**                 | The vendor only offers a pull API  | A polling worker that calls their "latest positions" endpoint and posts to the webhook        |
| **Simulator** (dev / demo)                   | Before vendor access, or for demos | Already built: `pnpm --filter @prismgo/api sim demo`                                          |

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

## Questions for the vendor

- Push (webhook) or pull? If push: payload format, retry policy, how they authenticate requests.
- If pull: endpoint for latest positions of all devices, recommended interval, rate limits.
- History endpoint to back-fill gaps after an outage.
- Field list: lat/lng, timestamp time zone, speed, heading, ignition, odometer.
