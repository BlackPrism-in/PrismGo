import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { get, patch, post } from './api';
import type {
  Availability,
  LiveVehicle,
  TripTrack,
  Department,
  Driver,
  NotificationItem,
  TripRequest,
  User,
  Vehicle,
} from './types';

export const keys = {
  departments: ['departments'] as const,
  users: (params = '') => ['users', params] as const,
  vehicles: ['vehicles'] as const,
  drivers: ['drivers'] as const,
  requests: (params = '') => ['requests', params] as const,
  request: (id: string) => ['request', id] as const,
  notifications: ['notifications'] as const,
  unread: ['notifications', 'unread'] as const,
  liveVehicles: ['live', 'vehicles'] as const,
  track: (tripId: string) => ['track', tripId] as const,
};

export const useDepartments = () =>
  useQuery({ queryKey: keys.departments, queryFn: () => get<Department[]>('/departments') });

export const useUsers = (params = '') =>
  useQuery({
    queryKey: keys.users(params),
    queryFn: () => get<User[]>(`/users${params ? `?${params}` : ''}`),
  });

export const useVehicles = () =>
  useQuery({ queryKey: keys.vehicles, queryFn: () => get<Vehicle[]>('/vehicles') });

export const useDrivers = () =>
  useQuery({ queryKey: keys.drivers, queryFn: () => get<Driver[]>('/drivers') });

/** params e.g. "scope=approvals&status=pending_approval" */
export const useRequests = (params = '') =>
  useQuery({
    queryKey: keys.requests(params),
    queryFn: () => get<TripRequest[]>(`/requests${params ? `?${params}` : ''}`),
  });

export const useRequest = (id: string) =>
  useQuery({
    queryKey: keys.request(id),
    queryFn: () => get<TripRequest>(`/requests/${id}`),
    enabled: id !== '',
  });

export const useAvailability = (window: { from: string; to: string; passengers: number } | null) =>
  useQuery({
    queryKey: ['availability', window],
    enabled: window !== null,
    queryFn: () =>
      get<Availability>(
        `/availability?from=${encodeURIComponent(window!.from)}&to=${encodeURIComponent(window!.to)}&passengers=${window!.passengers}`,
      ),
  });

export const useNotifications = () =>
  useQuery({
    queryKey: keys.notifications,
    queryFn: () => get<NotificationItem[]>('/notifications'),
  });

export const useUnreadCount = () =>
  useQuery({
    queryKey: keys.unread,
    queryFn: () => get<{ count: number }>('/notifications/unread-count'),
    refetchInterval: 60_000,
  });

/**
 * Create (no id) or update (with id) a resource, then refresh the listed query keys.
 * Users and departments both show HOD data, so saving one refreshes the other.
 */
export function useSave<TBody, TResult>(resource: string, invalidate: readonly string[]) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id?: string; body: TBody }) =>
      id ? patch<TResult>(`/${resource}/${id}`, body) : post<TResult>(`/${resource}`, body),
    onSuccess: () => Promise.all(invalidate.map((k) => qc.invalidateQueries({ queryKey: [k] }))),
  });
}

/** POST an action on a request (approve, reject, cancel, submit, assign) or trip (reassign). */
export function useRequestAction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ path, body }: { path: string; body?: unknown }) => post<TripRequest>(path, body),
    onSuccess: (updated) => {
      qc.setQueryData(keys.request(updated.id), updated);
      return Promise.all([
        qc.invalidateQueries({ queryKey: ['requests'] }),
        qc.invalidateQueries({ queryKey: ['availability'] }),
      ]);
    },
  });
}

/** Positions arrive over the socket; the poll is a safety net if it drops. */
export const useLiveVehicles = () =>
  useQuery({
    queryKey: keys.liveVehicles,
    queryFn: () => get<LiveVehicle[]>('/live/vehicles'),
    refetchInterval: 60_000,
  });

export const useTrack = (tripId: string | null | undefined) =>
  useQuery({
    queryKey: keys.track(tripId ?? ''),
    queryFn: () => get<TripTrack>(`/trips/${tripId}/track`),
    enabled: !!tripId,
    refetchInterval: 60_000,
  });
