import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { API_ORIGIN, getAccessToken, refreshSession } from './api';
import { applyToTrack, applyToVehicles, type VehiclePosition } from './live';
import { keys } from './queries';
import type { LiveVehicle, TripTrack } from './types';

/**
 * Live updates from the API. Keeps lists, details and the notification bell fresh
 * by invalidating queries when the server says something changed.
 */
export function useRealtime(enabled: boolean): void {
  const qc = useQueryClient();

  useEffect(() => {
    if (!enabled) return;
    const socket = io(API_ORIGIN || undefined, {
      path: '/api/v1/socket.io',
      transports: ['websocket'],
      // Read the token at every (re)connect so a refreshed token is used.
      auth: (cb) => cb({ token: getAccessToken() }),
    });

    socket.on('request.updated', (e: { id: string }) => {
      void qc.invalidateQueries({ queryKey: ['requests'] });
      void qc.invalidateQueries({ queryKey: keys.request(e.id) });
      void qc.invalidateQueries({ queryKey: ['availability'] });
      void qc.invalidateQueries({ queryKey: keys.liveVehicles });
      void qc.invalidateQueries({ queryKey: ['track'] });
    });
    socket.on('vehicle.position', (p: VehiclePosition) => {
      qc.setQueryData<LiveVehicle[]>(keys.liveVehicles, (list) => applyToVehicles(list, p));
      if (p.tripId) qc.setQueryData<TripTrack>(keys.track(p.tripId), (t) => applyToTrack(t, p));
    });
    socket.on('notification', () => {
      void qc.invalidateQueries({ queryKey: keys.notifications });
    });
    // Access token expired while connected: refresh, then reconnect with the new one.
    socket.on('unauthorized', () => {
      void refreshSession().then((r) => r === 'ok' && socket.connect());
    });

    return () => {
      socket.disconnect();
    };
  }, [enabled, qc]);
}
