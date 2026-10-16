import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:prismgo_api/prismgo_api.dart';

import '../core/push.dart';
import '../core/realtime.dart';
import '../features/auth/session_controller.dart';
import '../features/notifications/notifications_providers.dart';
import '../features/requests/requests_providers.dart';

class _Tab {
  const _Tab(this.path, this.label, this.icon, this.selectedIcon);

  final String path;
  final String label;
  final IconData icon;
  final IconData selectedIcon;
}

/// Bottom navigation for signed-in users. Tabs depend on role; the shell also
/// keeps the realtime connection open and the device registered for push.
class AppShell extends ConsumerWidget {
  const AppShell({super.key, required this.location, required this.child});

  final String location;
  final Widget child;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    ref.watch(realtimeProvider);
    ref.watch(pushProvider(GoRouter.of(context)));
    final me = ref.watch(sessionControllerProvider).value;
    final isHod = me?.roles.contains(Role.hod) ?? false;
    final canRequest = isHod || (me?.roles.contains(Role.requester) ?? false);
    final unread = ref.watch(unreadCountProvider);
    final pending = isHod
        ? ref.watch(requestsProvider(pendingApprovalsQuery)).value?.length ?? 0
        : 0;

    final tabs = [
      const _Tab('/', 'Home', Icons.home_outlined, Icons.home),
      if (canRequest)
        const _Tab(
          '/requests',
          'Requests',
          Icons.directions_car_outlined,
          Icons.directions_car,
        ),
      if (isHod)
        const _Tab(
          '/approvals',
          'Approvals',
          Icons.fact_check_outlined,
          Icons.fact_check,
        ),
      const _Tab(
        '/notifications',
        'Alerts',
        Icons.notifications_none,
        Icons.notifications,
      ),
    ];
    final index = tabs.lastIndexWhere(
      (t) => t.path == '/' ? location == '/' : location.startsWith(t.path),
    );

    Widget badged(IconData icon, int count) => count == 0
        ? Icon(icon)
        : Badge(label: Text(count > 9 ? '9+' : '$count'), child: Icon(icon));

    return Scaffold(
      body: child,
      bottomNavigationBar: NavigationBar(
        selectedIndex: index < 0 ? 0 : index,
        onDestinationSelected: (i) => context.go(tabs[i].path),
        destinations: [
          for (final t in tabs)
            NavigationDestination(
              icon: badged(
                t.icon,
                t.path == '/notifications'
                    ? unread
                    : t.path == '/approvals'
                    ? pending
                    : 0,
              ),
              selectedIcon: Icon(t.selectedIcon),
              label: t.label,
            ),
        ],
      ),
    );
  }
}
