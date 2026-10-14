/**
 * Every notification PrismGo sends. `title`/`body` are for in-app and console;
 * `whatsapp` names the Meta-approved template and its body parameters in order.
 * Template names must match what is registered in Meta Business Manager.
 */
export interface Message {
  template: string;
  title: string;
  body: string;
  whatsapp: { template: string; params: string[] };
}

const when = (d: Date) =>
  d.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  });

export interface RequestFacts {
  code: string;
  requesterName: string;
  departmentName: string;
  pickup: string;
  drop: string;
  startAt: Date;
}

export const messages = {
  submitted: (r: RequestFacts): Message => ({
    template: 'request_submitted',
    title: `Approval needed: ${r.code}`,
    body: `${r.requesterName} needs a vehicle on ${when(r.startAt)}: ${r.pickup} → ${r.drop}.`,
    whatsapp: {
      template: 'request_submitted',
      params: [r.requesterName, r.code, when(r.startAt), r.pickup, r.drop],
    },
  }),

  noHod: (r: RequestFacts): Message => ({
    template: 'request_no_hod',
    title: `No HOD for ${r.departmentName}`,
    body: `${r.code} from ${r.requesterName} is waiting for approval, but ${r.departmentName} has no HOD assigned.`,
    whatsapp: { template: 'request_no_hod', params: [r.code, r.departmentName] },
  }),

  approved: (r: RequestFacts, approver: string): Message => ({
    template: 'request_approved',
    title: `${r.code} approved`,
    body: `${approver} approved the trip on ${when(r.startAt)}. A vehicle will be assigned soon.`,
    whatsapp: { template: 'request_approved', params: [r.code, approver, when(r.startAt)] },
  }),

  readyToAssign: (r: RequestFacts): Message => ({
    template: 'request_ready_to_assign',
    title: `Assign a vehicle: ${r.code}`,
    body: `${r.departmentName} · ${when(r.startAt)} · ${r.pickup} → ${r.drop}.`,
    whatsapp: {
      template: 'request_ready_to_assign',
      params: [r.code, r.departmentName, when(r.startAt), r.pickup, r.drop],
    },
  }),

  rejected: (r: RequestFacts, approver: string, comment: string): Message => ({
    template: 'request_rejected',
    title: `${r.code} not approved`,
    body: `${approver}: ${comment}`,
    whatsapp: { template: 'request_rejected', params: [r.code, approver, comment] },
  }),

  assigned: (r: RequestFacts, vehicle: string, driver: string, driverPhone: string): Message => ({
    template: 'trip_assigned',
    title: `Vehicle assigned: ${r.code}`,
    body: `${vehicle} with ${driver} (${driverPhone}) on ${when(r.startAt)}.`,
    whatsapp: {
      template: 'trip_assigned',
      params: [r.code, vehicle, driver, driverPhone, when(r.startAt)],
    },
  }),

  driverAssigned: (r: RequestFacts, vehicle: string, requesterPhone: string): Message => ({
    template: 'driver_trip_assigned',
    title: `New trip ${r.code}`,
    body: `${when(r.startAt)} · ${vehicle} · pick up ${r.requesterName} (${requesterPhone}) at ${r.pickup}, drop at ${r.drop}.`,
    whatsapp: {
      template: 'driver_trip_assigned',
      params: [r.code, when(r.startAt), vehicle, r.requesterName, requesterPhone, r.pickup, r.drop],
    },
  }),

  cancelled: (r: RequestFacts, by: string, reason: string | null): Message => ({
    template: 'trip_cancelled',
    title: `${r.code} cancelled`,
    body: `${by} cancelled the trip on ${when(r.startAt)}${reason ? `: ${reason}` : '.'}`,
    whatsapp: {
      template: 'trip_cancelled',
      params: [r.code, by, when(r.startAt), reason ?? '-'],
    },
  }),

  tripStarted: (r: RequestFacts, vehicle: string, etaMinutes: number | null): Message => ({
    template: 'trip_started',
    title: `${r.code} is on the way`,
    body: `${vehicle} has left ${r.pickup}${etaMinutes ? `. About ${etaMinutes} min to ${r.drop}` : ''}.`,
    whatsapp: {
      template: 'trip_started',
      params: [r.code, vehicle, r.pickup, etaMinutes ? `${etaMinutes} min` : '-'],
    },
  }),

  tripCompleted: (r: RequestFacts, distanceKm: number | null): Message => ({
    template: 'trip_completed',
    title: `${r.code} completed`,
    body: `Trip to ${r.drop} completed${distanceKm ? ` · ${distanceKm.toFixed(1)} km` : ''}.`,
    whatsapp: {
      template: 'trip_completed',
      params: [r.code, r.drop, distanceKm ? `${distanceKm.toFixed(1)} km` : '-'],
    },
  }),

  gpsLost: (r: RequestFacts, vehicle: string, minutes: number): Message => ({
    template: 'gps_lost',
    title: `No GPS from ${vehicle}`,
    body: `${r.code} is in progress but ${vehicle} has sent no location for ${minutes} min.`,
    whatsapp: { template: 'gps_lost', params: [vehicle, r.code, String(minutes)] },
  }),
};
