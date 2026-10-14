import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:prismgo_api/prismgo_api.dart';

import '../../core/api.dart';

final notificationsProvider = FutureProvider.autoDispose<List<NotificationDto>>(
  (ref) async {
    final res = await ref
        .watch(apiProvider)
        .getNotificationsApi()
        .notificationsControllerList();
    return res.data ?? const [];
  },
);

/// Unread count derived from the list, so one fetch drives both the badge and the screen.
final unreadCountProvider = Provider.autoDispose<int>((ref) {
  final list = ref.watch(notificationsProvider).value ?? const [];
  return list.where((n) => n.readAt == null).length;
});

class NotificationActions {
  NotificationActions(this._ref);

  final Ref _ref;

  NotificationsApi get _api => _ref.read(apiProvider).getNotificationsApi();

  Future<void> markRead(String id) async {
    await _api.notificationsControllerMarkRead(id: id);
    _ref.invalidate(notificationsProvider);
  }

  Future<void> markAllRead() async {
    await _api.notificationsControllerMarkAllRead();
    _ref.invalidate(notificationsProvider);
  }
}

final notificationActionsProvider = Provider<NotificationActions>(
  NotificationActions.new,
);
