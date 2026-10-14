export const REQUEST_STATUSES = [
  'draft',
  'pending_approval',
  'approved',
  'rejected',
  'assigned',
  'in_progress',
  'completed',
  'cancelled',
] as const;
export type RequestStatus = (typeof REQUEST_STATUSES)[number];

export const TRIP_STATUSES = ['scheduled', 'in_progress', 'completed', 'cancelled'] as const;
export type TripStatus = (typeof TRIP_STATUSES)[number];

export const VEHICLE_STATUSES = ['available', 'on_trip', 'maintenance', 'inactive'] as const;
export type VehicleStatus = (typeof VEHICLE_STATUSES)[number];

export const DRIVER_STATUSES = ['active', 'on_leave', 'inactive'] as const;
export type DriverStatus = (typeof DRIVER_STATUSES)[number];

export const TRIP_EVENT_TYPES = [
  'assigned',
  'reassigned',
  'started',
  'picked_up',
  'dropped',
  'ended',
  'gps_lost',
] as const;
export type TripEventType = (typeof TRIP_EVENT_TYPES)[number];

/** Where a trip event came from: the tracker-driven detector or a manager override. */
export const TRIP_EVENT_SOURCES = ['tracker', 'manager', 'system'] as const;
export type TripEventSource = (typeof TRIP_EVENT_SOURCES)[number];
