import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:socket_io_client/socket_io_client.dart' as io;

import '../features/auth/session_controller.dart';
import '../features/notifications/notifications_providers.dart';
import '../features/requests/requests_providers.dart';
import '../features/tracking/trip_track.dart';
import 'api.dart';
import 'config.dart';

/// Live updates while signed in. Server events invalidate the matching providers,
/// so open screens refresh themselves. Keep it alive by watching it in the shell.
final realtimeProvider = Provider.autoDispose<void>((ref) {
  final me = ref.watch(sessionControllerProvider).value;
  if (me == null) return;

  final tokens = ref.read(tokenStorageProvider);
  final socket = io.io(
    AppConfig.apiOrigin,
    io.OptionBuilder()
        .setPath('/api/v1/socket.io')
        .setTransports(['websocket'])
        .disableAutoConnect()
        .enableReconnection()
        .build(),
  );

  Future<void> connect() async {
    socket.auth = {'token': await tokens.accessToken};
    socket.connect();
  }

  socket.on('request.updated', (data) {
    final id = data is Map ? data['id'] as String? : null;
    refreshRequests(ref, id);
    ref.invalidate(tripTrackProvider);
  });
  socket.on('notification', (_) => ref.invalidate(notificationsProvider));
  socket.on('vehicle.position', (data) {
    if (data is Map) applyVehiclePosition(ref, Map<String, dynamic>.from(data));
  });
  // Access token expired: any API call refreshes it through the interceptor,
  // then reconnect with the new one.
  socket.on('unauthorized', (_) async {
    try {
      await ref.read(apiProvider).getAuthApi().authControllerMe();
      await connect();
    } catch (e) {
      debugPrint('Realtime reconnect failed: $e');
    }
  });

  connect();
  ref.onDispose(socket.dispose);
});
