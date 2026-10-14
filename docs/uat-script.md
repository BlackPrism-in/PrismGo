# PrismGo MVP: UAT script

Run with the client on the UAT server, each person on their own device. Mark each step **Pass** or **Fail** and note what happened. A Fail on a step marked ★ blocks go-live. Others go on the fix list.

**Date:** ____________ **Server:** https://____________ **Build (APK/web):** ____________

## Before the session

- [ ] Server deployed per [deployment.md](deployment.md) with `APP_ENV=staging`. Until WhatsApp is approved: `OTP_CHANNELS=console`, `MESSAGING_PROVIDER=console`, `OTP_EXPOSE_CODE=true` (login code shown on screen).
- [ ] Client master data imported. Vehicle GPS device ids match the vendor's.
- [ ] APK installed on the requester's and HOD's Android phones (iPhone: TestFlight or web).
- [ ] People and phones for the session:

| Role                      | Name | Phone | Device      |
| ------------------------- | ---- | ----- | ----------- |
| Requester (R)             |      |       | Mobile app  |
| HOD of R's department (H) |      |       | Mobile app  |
| Transport Manager (TM)    |      |       | Web, laptop |
| Super admin (SA)          |      |       | Web         |

- [ ] Live GPS: vendor feed connected, **or** the simulator ready on a laptop (section 6).

## 1. Login

| #     | Who | Steps                                                    | Expected                                                          | Result |
| ----- | --- | -------------------------------------------------------- | ----------------------------------------------------------------- | ------ |
| 1.1 ★ | All | Open the app or web, enter mobile number, enter the code | Logged in; home shows the person's name and role-based menu       |        |
| 1.2   | R   | Enter a wrong code 5 times                               | Clear error; a new code must be requested                         |        |
| 1.3   | —   | Log in with a number that isn't registered               | Same "code sent" message, but no code works (number not revealed) |        |
| 1.4   | R   | Close and reopen the app next day / after 15 minutes     | Still logged in                                                   |        |
| 1.5   | R   | Log out                                                  | Back on the login screen                                          |        |

## 2. Master data (SA, web)

| #     | Steps                                              | Expected                                          | Result |
| ----- | -------------------------------------------------- | ------------------------------------------------- | ------ |
| 2.1 ★ | Admin → Departments, Users, Vehicles, Drivers      | Imported data correct: names, phones, HODs, seats |        |
| 2.2   | Add a user, change their role, deactivate them     | Deactivated user can no longer log in             |        |
| 2.3   | Add a vehicle with a duplicate registration number | Refused with a clear message                      |        |
| 2.4   | Set a vehicle to "maintenance"                     | It is not offered when assigning                  |        |

## 3. Request and approval

| #     | Who | Steps                                                                             | Expected                                                                             | Result |
| ----- | --- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | ------ |
| 3.1 ★ | R   | New request: pickup, drop, date/time 1–2 hours ahead, passengers, purpose. Submit | Request number PG-xxxx, status "Pending approval"; timeline shows "Submitted"        |        |
| 3.2 ★ | H   | —                                                                                 | Notification "Approval needed" (in-app; WhatsApp once live); request under Approvals |        |
| 3.3 ★ | H   | Approve with a comment                                                            | Status "Approved"; R notified within seconds, R's screen updates without refresh     |        |
| 3.4 ★ | TM  | —                                                                                 | Notification "Assign a vehicle"; request in Dispatch → To assign                     |        |
| 3.5   | R   | Make a second request; H declines it with a reason                                | Status "Rejected", reason visible to R; R notified                                   |        |
| 3.6   | H   | H makes a request for themselves                                                  | Goes straight to "Approved" (no self-approval step)                                  |        |
| 3.7   | R   | Save a request as draft, edit it, then submit                                     | Draft editable; submit moves it to Pending approval                                  |        |
| 3.8   | R   | Cancel a pending request                                                          | Status "Cancelled"; H no longer sees it under Approvals                              |        |
| 3.9   | R   | Try a pickup time in the past, or return before start                             | Refused with a clear message                                                         |        |

## 4. Assignment (TM, web)

| #     | Steps                                                                    | Expected                                                                                | Result |
| ----- | ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------- | ------ |
| 4.1 ★ | Open the approved request from 3.3 → Assign; pick a vehicle and a driver | Only free vehicles with enough seats and free drivers offered; status "Assigned"        |        |
| 4.2 ★ | —                                                                        | R notified with vehicle number, driver name and phone; driver gets WhatsApp (once live) |        |
| 4.3   | Approve another overlapping request and try the same vehicle or driver   | Shown as busy; cannot be double-booked                                                  |        |
| 4.4   | Reassign 4.1 to the other vehicle                                        | Vehicle changes; R notified                                                             |        |
| 4.5   | Two TMs assign the same request at the same moment (two browsers)        | One succeeds; the other gets "already assigned"                                         |        |

## 5. Live tracking and trip (with GPS)

| #     | Who    | Steps                                                   | Expected                                                                              | Result |
| ----- | ------ | ------------------------------------------------------- | ------------------------------------------------------------------------------------- | ------ |
| 5.1 ★ | TM     | Live map                                                | Every vehicle with GPS appears at its real position; "no signal" marked on stale ones |        |
| 5.2 ★ | R      | Open the assigned request within an hour of pickup      | Map shows the vehicle approaching with an ETA to pickup                               |        |
| 5.3 ★ | Driver | Drive to pickup, then leave                             | Trip starts by itself ("In progress"); R notified "on the way"                        |        |
| 5.4 ★ | R, TM  | Watch during the trip                                   | Vehicle moves on the map; path drawn; ETA to drop updates                             |        |
| 5.5 ★ | Driver | Arrive at drop (one way) / back at pickup (with return) | Trip completes by itself; km recorded; R and TM notified                              |        |
| 5.6   | TM     | On another trip: Start trip now, then End trip          | Manual start/end works; timeline shows the TM's name                                  |        |
| 5.7   | TM     | Vehicle loses GPS for over 5 minutes during a trip      | TM alerted "GPS signal lost"; vehicle back on the map when signal returns             |        |
| 5.8   | R      | Open a trip scheduled for tomorrow                      | No vehicle position shown yet                                                         |        |

## 6. Live tracking without the vendor feed (simulator)

Use this instead of section 5 until the vendor's GPS feed is connected. On a laptop with the repo:

```bash
SIM_API_URL=https://<domain>/api/v1 GPS_WEBHOOK_SECRET=<secret> SIM_MANAGER_PHONE=<TM phone> pnpm --filter @prismgo/api sim PG-xxxx
```

It drives the assigned vehicle from near the pickup to the drop. Steps 5.1–5.5 then apply as written. Run it only with `OTP_EXPOSE_CODE=true`, because it logs in as the TM with the on-screen code.

## 7. Notifications

| #   | Steps                                   | Expected                                                          | Result |
| --- | --------------------------------------- | ----------------------------------------------------------------- | ------ |
| 7.1 | Bell / Alerts tab after the steps above | Every event listed, newest first; unread count; tap opens request |        |
| 7.2 | WhatsApp (once templates approved)      | Each message arrives on the right phone with correct details      |        |

## 8. Mobile and web basics

| #   | Steps                                                    | Expected                                            | Result |
| --- | -------------------------------------------------------- | --------------------------------------------------- | ------ |
| 8.1 | Turn off mobile data, then on                            | App says it's offline, recovers without logging out |        |
| 8.2 | Web on phone browser                                     | Usable; no sideways scrolling                       |        |
| 8.3 | R tries to open another department's request by its link | "Not found"                                         |        |

## Sign-off

Fix list: blockers (★ fails) fixed and re-tested the same day; the rest scheduled.

| Fix # | Step | Problem | Blocker? | Fixed / retested |
| ----- | ---- | ------- | -------- | ---------------- |
|       |      |         |          |                  |

**Client sign-off:** name ____________ signature ____________ date ____________

After sign-off, for go-live: set `OTP_EXPOSE_CODE=false`. Switch to `APP_ENV=production` with WhatsApp keys once templates are approved.
