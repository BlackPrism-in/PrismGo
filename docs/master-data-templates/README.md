# Master data templates

Fill these in (Excel → Save As CSV UTF-8), then import with `scripts/import-master-data.ts` (see docs/deployment.md).

| File            | Columns                                                  | Notes                                                                                                            |
| --------------- | -------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| departments.csv | name, cost_centre, hod_phone                             | hod_phone must be a user with the `hod` role                                                                     |
| users.csv       | name, phone, email, roles, department                    | roles separated by `;`: requester, hod, transport_manager, super_admin. Phone = 10-digit mobile they log in with |
| vehicles.csv    | reg_no, type, make, model, seats, gps_device_id          | gps_device_id = tracker id from the GPS vendor (IMEI or device id)                                               |
| drivers.csv     | name, phone, licence_no, licence_expiry, default_vehicle | licence_expiry as YYYY-MM-DD; default_vehicle = reg_no                                                           |

The example rows are made up; replace them.
