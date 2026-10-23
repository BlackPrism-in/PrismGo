# PrismGo: walkthrough by role

What each role does, step by step, with a screenshot of each step. Captured on 23 Oct 2026 from the web app running locally with sample data (Siliguri addresses, the client's two vehicles WB74BS4165 and WB73L9779). The live demo at https://prismgo.blackprism.in looks the same.

Requesters and HODs normally use the Android app; the screens and steps there are the same. Everyone can also use the web app.

| Role              | Sample user     | What they do                                                                                           |
| ----------------- | --------------- | ------------------------------------------------------------------------------------------------------ |
| Requester         | Rahul Requester | Requests a vehicle, follows its status and the vehicle on the map                                      |
| HOD               | Hema Ops HOD    | Approves or declines requests from their department; can also raise their own (approved automatically) |
| Transport Manager | Tarun Transport | Assigns a vehicle and driver, watches the live map, manages master data                                |
| Super Admin       | Asha Admin      | Same screens as the Transport Manager; sets up departments, users, vehicles and drivers                |

Drivers have no login. They get trip details on WhatsApp, and trips start and end by themselves from the vehicle's GPS tracker.

## 1. Logging in (everyone)

No passwords: the person enters their mobile number and gets a 6-digit code on WhatsApp.

![Enter mobile number](01-login-phone.jpg)

Enter the code. The yellow "Test code" box appears only on test servers when WhatsApp can't deliver; it is switched off at go-live.

![Enter the code](02-login-code.jpg)

## 2. Requester: request a vehicle

**2.1** The dashboard shows the requester's upcoming trips. Click **Request a vehicle**.

![Requester dashboard](03-requester-dashboard.jpg)

**2.2** Fill in pickup and drop (address, and coordinates copied from Google Maps), pickup time, optional return time, number of people, purpose and notes for transport. **Submit for approval**, or **Save draft** to finish later.

![New request form](04-requester-new-request.jpg)

**2.3** The request gets a number (PG-1006) and status **Awaiting approval**. The history on the right records every step. Until it is approved the requester can **Edit** or **Cancel trip**.

![Request submitted](05-requester-request-submitted.jpg)

**2.4** **My requests** lists all their requests with status.

![My requests](06-requester-my-requests.jpg)

## 3. HOD: approve or decline

**3.1** The HOD is notified straight away (bell in the app, WhatsApp on the live server).

![HOD notification](07-hod-notification.jpg)

**3.2** **Approvals** lists requests from their department waiting for them.

![Approvals](08-hod-approvals.jpg)

**3.3** **Approve** with an optional comment, or **Decline** with a reason (required, shown to the requester).

![Approve with comment](09-hod-approve-comment.jpg)

**3.4** The request moves to **Recent**. The requester and the Transport Managers are notified.

![Approved](10-hod-approved.jpg)

## 4. Transport Manager: assign and track

**4.1** The dashboard counts what needs attention: requests to assign, trips assigned but not started, and requests still waiting for an HOD.

![Transport Manager dashboard](11-tm-dashboard.jpg)

**4.2** **Dispatch** groups requests: to assign, on the way, assigned but not started, waiting for HOD approval. Click **Assign**.

![Dispatch](12-tm-dispatch-to-assign.jpg)

**4.3** Pick a vehicle and a driver. Only vehicles with enough seats are offered, and each shows **Free** or the trip it clashes with, so nothing can be double-booked. The driver who usually drives the vehicle is marked.

![Assign vehicle and driver](13-tm-assign-vehicle-driver.jpg)

**4.4** The trip moves to **Assigned, not started**. The requester is notified with the vehicle number, driver name and phone; the driver gets the trip on WhatsApp. **Change** reassigns it.

![Assigned](14-tm-assigned.jpg)

**4.5** **Live map** shows every vehicle with GPS, its next trip and the time to pickup.

![Live map before pickup](15-tm-live-map-before-pickup.jpg)

**4.6** When the vehicle leaves the pickup point the trip starts by itself: status **On a trip**, with the time to drop.

![Live map on a trip](16-tm-live-map-on-trip.jpg)

**4.7** Opening the trip shows the vehicle moving on the map with the time to drop, and the full history. **End trip** is a manual override; normally the trip ends by itself at the drop.

![Trip tracking](17-tm-trip-tracking.jpg)

**4.8** Master data. **Vehicles**: registration number, type, seats, GPS tracker and status (available, on trip, maintenance). The GPS tracker fills itself in when the GPS vendor reports the registration number.

![Vehicles](18-tm-vehicles.jpg)

**Drivers**: name, phone, licence and usual vehicle.

![Drivers](19-tm-drivers.jpg)

**Departments**: each has one HOD who approves its requests.

![Departments](20-tm-departments.jpg)

**Users**: everyone who logs in, with roles and department; search and filter by role or department.

![Users](21-tm-users.jpg)

![Add user](22-tm-add-user.jpg)

## 5. Requester: follow the trip

**5.1** Once assigned, the trip shows the vehicle and driver on the requester's dashboard; status changes appear without refreshing.

![Requester trips](23-requester-trips-assigned.jpg)

**5.2** Notifications for each step: approved, vehicle assigned, on the way.

![Requester notifications](24-requester-notifications.jpg)

**5.3** After the trip: **Completed**, the distance driven (10.1 km) and the route on the map.

![Trip completed](25-requester-trip-completed.jpg)

## 6. Super Admin: set up the organisation

**6.1** The Super Admin has the Transport Manager's screens: dashboard, dispatch, live map and master data. They are not tied to a department.

![Super Admin dashboard](26-admin-dashboard.jpg)

**6.2** Adding a user: name, mobile number (used to log in), optional email, one or more roles, and a department (needed for requesters and HODs). Setting a user to inactive blocks their login.

![Add user](27-admin-add-user.jpg)

![User added](28-admin-user-added.jpg)

## Request statuses

Draft → Awaiting approval → Approved (or Declined) → Vehicle assigned → On the way → Completed. A request can be cancelled until the trip starts.
