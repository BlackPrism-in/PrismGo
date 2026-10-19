# WhatsApp message templates

PrismGo sends these through the WhatsApp Cloud API. **Each template must be created and approved in Meta Business Manager before go-live** (WhatsApp Manager → Message templates). Approval usually takes minutes to a day, but can take longer for a new business account.

- Language: create each template as **English** (code `en`, not English (US)).
- Names and the order of the `{{n}}` variables must match exactly; the code fills them in that order (`apps/api/src/notifications/messages.ts`).
- Meta rejects a body that starts or ends with a variable, or has too many variables for its length, so every body starts and ends with fixed words and variables appear in order.
- Status: all 12 **approved (Active)** on 19 Oct 2026 (BlackPrism account, sender +91 70014 41439, phone number ID `1267308809792402`). PrismGo sends login codes and alerts with them since 19 Oct.
- Until a template is approved, set `MESSAGING_PROVIDER=console` (messages are only logged) and people still get in-app notifications.

| Template name             | Category       | Sent to                                                 | Body                                                                                                                                                                                                                   |
| ------------------------- | -------------- | ------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `login_code`              | Authentication | Anyone logging in                                       | Meta's authentication template (Copy code): "{{1}} is your verification code. For your security, do not share this code. Expires in 5 minutes."                                                                        |
| `request_submitted`       | Utility        | HOD                                                     | Approval needed: {{1}} has requested a vehicle ({{2}}) for {{3}}, from {{4}} to {{5}}. Please review it in PrismGo.                                                                                                    |
| `request_no_hod`          | Utility        | Transport managers, admins                              | Request {{1}} is waiting for approval, but {{2}} has no HOD assigned in PrismGo.                                                                                                                                       |
| `request_approved`        | Utility        | Requester                                               | Your vehicle request {{1}} was approved by {{2}} for {{3}}. A vehicle will be assigned soon.                                                                                                                           |
| `request_ready_to_assign` | Utility        | Transport managers                                      | Request {{1}} from {{2}} is approved for {{3}}: {{4}} to {{5}}. Please assign a vehicle in PrismGo.                                                                                                                    |
| `request_rejected`        | Utility        | Requester                                               | Your vehicle request {{1}} was not approved by {{2}}. Reason: {{3}}. You can raise a new request in PrismGo.                                                                                                           |
| `trip_assigned`           | Utility        | Requester                                               | Good news: a vehicle has been assigned for your request {{1}}. Vehicle: {{2}}. Driver: {{3}}, phone {{4}}. Pickup time: {{5}}. Please be ready a few minutes early. Have a safe trip.                                  |
| `driver_trip_assigned`    | Utility        | Driver                                                  | You have a new trip {{1}} scheduled for {{2}}. Vehicle: {{3}}. Passenger: {{4}}, phone {{5}}. Pickup point: {{6}}. Drop point: {{7}}. Please reach the pickup point on time and call the passenger if you are delayed. |
| `trip_cancelled`          | Utility        | Requester, HOD, transport, driver (whoever is involved) | Your trip {{1}} has been cancelled by {{2}}. It was scheduled for {{3}}. Reason given: {{4}}. No further action is needed from you, and you can raise a new request in PrismGo at any time.                            |
| `trip_started`            | Utility        | Requester                                               | Your trip {{1}} is on the way: {{2}} has left {{3}}. Estimated time to destination: {{4}}. You can track the vehicle live in PrismGo.                                                                                  |
| `trip_completed`          | Utility        | Requester, transport managers                           | Your trip {{1}} to {{2}} is complete. Distance travelled: {{3}}. Thank you for using PrismGo, and have a great day.                                                                                                    |
| `gps_lost`                | Utility        | Transport managers                                      | Alert: no GPS signal from vehicle {{1}} while trip {{2}} is in progress, for the last {{3}} minutes. Please call the driver and check that the tracker is working.                                                     |

## Sample values (Meta asks for these when submitting)

| Template                  | Samples in order                                                                                                    |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `request_submitted`       | Rahul Verma · PG-1042 · 20 Oct, 9:30 am · MG Road Office · Bengaluru Airport                                        |
| `request_no_hod`          | PG-1042 · Operations                                                                                                |
| `request_approved`        | PG-1042 · Hema Rao · 20 Oct, 9:30 am                                                                                |
| `request_ready_to_assign` | PG-1042 · Operations · 20 Oct, 9:30 am · MG Road Office · Bengaluru Airport                                         |
| `request_rejected`        | PG-1042 · Hema Rao · Please use the shuttle for this route                                                          |
| `trip_assigned`           | PG-1042 · KA01AB1001 (Sedan) · Suresh Kumar · +91 90000 00101 · 20 Oct, 9:30 am                                     |
| `driver_trip_assigned`    | PG-1042 · 20 Oct, 9:30 am · KA01AB1001 (Sedan) · Rahul Verma · +91 98123 45678 · MG Road Office · Bengaluru Airport |
| `trip_cancelled`          | PG-1042 · Rahul Verma · 20 Oct, 9:30 am · Meeting moved online                                                      |
| `trip_started`            | PG-1042 · KA01AB1001 · MG Road Office · 35 min                                                                      |
| `trip_completed`          | PG-1042 · Bengaluru Airport · 34.2 km                                                                               |
| `gps_lost`                | KA01AB1001 · PG-1042 · 6                                                                                            |

## Settings

```
MESSAGING_PROVIDER=whatsapp
OTP_CHANNELS=whatsapp
WHATSAPP_PHONE_NUMBER_ID=<from WhatsApp Manager → API setup>
WHATSAPP_ACCESS_TOKEN=<permanent system-user token>
WHATSAPP_OTP_TEMPLATE=login_code
```
