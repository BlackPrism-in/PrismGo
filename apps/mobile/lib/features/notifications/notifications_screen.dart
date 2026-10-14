import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../app/theme.dart';
import '../../core/api.dart';
import '../../shared/format.dart';
import '../../shared/widgets.dart';
import 'notifications_providers.dart';

class NotificationsScreen extends ConsumerWidget {
  const NotificationsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final async = ref.watch(notificationsProvider);
    final unread = ref.watch(unreadCountProvider);
    final actions = ref.read(notificationActionsProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Alerts'),
        actions: [
          if (unread > 0)
            TextButton(
              onPressed: actions.markAllRead,
              child: const Text('Mark all read'),
            ),
        ],
      ),
      body: async.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => EmptyState(
          icon: Icons.cloud_off_outlined,
          message: errorMessage(e),
        ),
        data: (list) => list.isEmpty
            ? const EmptyState(
                icon: Icons.notifications_none,
                message: 'No alerts yet.',
              )
            : RefreshIndicator(
                onRefresh: () => ref.refresh(notificationsProvider.future),
                child: ListView.separated(
                  itemCount: list.length,
                  separatorBuilder: (_, _) => const Divider(height: 1),
                  itemBuilder: (context, i) {
                    final n = list[i];
                    final isUnread = n.readAt == null;
                    return ListTile(
                      tileColor: isUnread
                          ? Brand.coralLight.withValues(alpha: 0.35)
                          : null,
                      title: Text(
                        n.title,
                        style: TextStyle(
                          fontWeight: isUnread
                              ? FontWeight.w600
                              : FontWeight.normal,
                        ),
                      ),
                      subtitle: Text('${n.body}\n${timeAgo(n.createdAt)}'),
                      isThreeLine: true,
                      trailing: isUnread
                          ? const Icon(
                              Icons.circle,
                              size: 10,
                              color: Brand.coral,
                              semanticLabel: 'unread',
                            )
                          : null,
                      onTap: () {
                        if (isUnread) actions.markRead(n.id);
                        if (n.requestId != null) {
                          context.push('/requests/${n.requestId}');
                        }
                      },
                    );
                  },
                ),
              ),
      ),
    );
  }
}
