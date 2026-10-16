// The server sends with FCM HTTP v1, which targets registration tokens, so this
// keeps the (deprecated, still supported) token API rather than register()/FIDs.
// ignore_for_file: deprecated_member_use

import 'dart:async';

import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:prismgo_api/prismgo_api.dart';

import '../features/auth/session_controller.dart';
import '../features/notifications/notifications_providers.dart';
import 'api.dart';

/// Firebase starts at launch when the app was built with google-services.json.
/// Without it (or on iOS until APNs is set up) push is simply off.
Future<bool> initPush() async {
  try {
    await Firebase.initializeApp();
    return true;
  } catch (e) {
    debugPrint('Push disabled: $e');
    return false;
  }
}

/// Set from main() with the result of [initPush]; tests leave it false.
final pushAvailableProvider = Provider<bool>((_) => false);

/// Registers this device's FCM token for the signed-in user and opens the request
/// when a notification is tapped. Watched in the shell, like the realtime socket.
final pushProvider = Provider.autoDispose.family<void, GoRouter>((ref, router) {
  if (!ref.watch(pushAvailableProvider)) return;
  final me = ref.watch(sessionControllerProvider).value;
  if (me == null) return;

  final messaging = FirebaseMessaging.instance;
  final subs = <StreamSubscription<Object?>>[];

  Future<void> register(String token) async {
    try {
      await ref
          .read(apiProvider)
          .getNotificationsApi()
          .devicesControllerRegister(
            registerDeviceDto: RegisterDeviceDto(
              token: token,
              platform: defaultTargetPlatform == TargetPlatform.iOS
                  ? RegisterDeviceDtoPlatformEnum.ios
                  : RegisterDeviceDtoPlatformEnum.android,
            ),
          );
    } catch (e) {
      debugPrint('Push token not registered: $e');
    }
  }

  void open(RemoteMessage m) {
    final id = m.data['requestId'];
    if (id is String && id.isNotEmpty) router.push('/requests/$id');
  }

  Future<void> start() async {
    // Android 13+ asks the user; earlier versions allow by default.
    await messaging.requestPermission();
    final token = await messaging.getToken();
    if (token != null) await register(token);
    subs.add(messaging.onTokenRefresh.listen(register));
    // In the foreground the system shows nothing; refresh the bell instead.
    subs.add(
      FirebaseMessaging.onMessage.listen(
        (_) => ref.invalidate(notificationsProvider),
      ),
    );
    subs.add(FirebaseMessaging.onMessageOpenedApp.listen(open));
    final initial = await messaging.getInitialMessage();
    if (initial != null) open(initial);
  }

  unawaited(start());
  ref.onDispose(() {
    for (final s in subs) {
      s.cancel();
    }
  });
});

/// On logout: stop this device receiving the user's notifications.
Future<void> unregisterPush(PrismgoApi api) async {
  try {
    final token = await FirebaseMessaging.instance.getToken();
    if (token == null) return;
    await api.getNotificationsApi().devicesControllerUnregister(token: token);
    await FirebaseMessaging.instance.deleteToken();
  } catch (e) {
    debugPrint('Push token not removed: $e');
  }
}
