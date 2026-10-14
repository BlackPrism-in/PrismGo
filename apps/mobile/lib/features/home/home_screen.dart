import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:prismgo_api/prismgo_api.dart';

import '../../app/logo.dart';
import '../../app/theme.dart';
import '../../core/phone.dart';
import '../../shared/widgets.dart';
import '../auth/session_controller.dart';
import '../requests/requests_providers.dart';
import 'api_health.dart';

const _roleLabels = {
  Role.requester: 'Requester',
  Role.hod: 'HOD',
  Role.transportManager: 'Transport Manager',
  Role.superAdmin: 'Super Admin',
};

const _upcoming = {
  RequestStatus.pendingApproval,
  RequestStatus.approved,
  RequestStatus.assigned,
  RequestStatus.inProgress,
};

class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key, required this.me});

  final MeDto me;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final isHod = me.roles.contains(Role.hod);
    final canRequest = isHod || me.roles.contains(Role.requester);
    final isManager =
        me.roles.contains(Role.transportManager) ||
        me.roles.contains(Role.superAdmin);
    final mine = canRequest
        ? ref.watch(requestsProvider(myRequestsQuery))
        : null;
    final pending = isHod
        ? ref.watch(requestsProvider(pendingApprovalsQuery))
        : null;
    final upcoming =
        (mine?.value ?? []).where((r) => _upcoming.contains(r.status)).toList()
          ..sort((a, b) => a.startAt.compareTo(b.startAt));

    return Scaffold(
      appBar: AppBar(
        title: const Logo(fontSize: 22),
        actions: [
          IconButton(
            tooltip: 'Log out',
            icon: const Icon(Icons.logout),
            onPressed: () =>
                ref.read(sessionControllerProvider.notifier).logout(),
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () async {
          ref.invalidate(requestsProvider);
          ref.invalidate(apiHealthProvider);
        },
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            Text(
              'Hello, ${me.name.split(' ').first}',
              style: theme.textTheme.headlineSmall,
            ),
            const SizedBox(height: 4),
            Text(
              [
                me.orgName,
                if (me.department != null) me.department!.name,
              ].join(' · '),
            ),
            const SizedBox(height: 16),
            if (canRequest)
              FilledButton.icon(
                onPressed: () => context.push('/requests/new'),
                icon: const Icon(Icons.add),
                label: const Padding(
                  padding: EdgeInsets.symmetric(vertical: 12),
                  child: Text('Request a vehicle'),
                ),
              ),
            if (isHod && (pending?.value?.isNotEmpty ?? false)) ...[
              const SizedBox(height: 12),
              Card(
                color: Brand.coralLight,
                child: ListTile(
                  leading: const Icon(
                    Icons.fact_check_outlined,
                    color: Brand.ink,
                  ),
                  title: Text(
                    '${pending!.value!.length} waiting for your approval',
                    style: const TextStyle(fontWeight: FontWeight.w600),
                  ),
                  trailing: const Icon(Icons.chevron_right),
                  onTap: () => context.go('/approvals'),
                ),
              ),
            ],
            if (isManager)
              const Card(
                child: ListTile(
                  leading: CircleAvatar(
                    backgroundColor: Brand.mint,
                    foregroundColor: Brand.ink,
                    child: Icon(Icons.desktop_windows_outlined),
                  ),
                  title: Text('Use the web app'),
                  subtitle: Text(
                    'Assignment, live map and master data are on the web.',
                  ),
                ),
              ),
            if (canRequest) ...[
              const SizedBox(height: 20),
              Text('Your upcoming trips', style: theme.textTheme.titleSmall),
              if (mine?.isLoading ?? false)
                const Padding(
                  padding: EdgeInsets.all(24),
                  child: Center(child: CircularProgressIndicator()),
                )
              else if (upcoming.isEmpty)
                const Padding(
                  padding: EdgeInsets.symmetric(vertical: 16),
                  child: Text(
                    'No upcoming trips.',
                    style: TextStyle(color: Brand.sand600),
                  ),
                ),
              for (final r in upcoming)
                RequestTile(
                  request: r,
                  onTap: () => context.push('/requests/${r.id}'),
                ),
            ],
            const SizedBox(height: 20),
            Card(
              child: ListTile(
                title: Text(me.name),
                subtitle: Text(
                  '${formatIndianMobile(me.phone)}\n'
                  '${me.roles.map((r) => _roleLabels[r]).join(', ')}',
                ),
                isThreeLine: true,
              ),
            ),
            const SizedBox(height: 8),
            const _ApiStatus(),
          ],
        ),
      ),
    );
  }
}

class _ApiStatus extends ConsumerWidget {
  const _ApiStatus();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final (label, color) = ref
        .watch(apiHealthProvider)
        .when(
          loading: () => ('Checking API…', Brand.sand500),
          error: (_, _) => ('API unreachable', Brand.coral),
          data: (h) => switch (h) {
            ApiHealth.online => ('API online', Brand.mintText),
            ApiHealth.degraded => ('API degraded', Brand.coral),
            ApiHealth.unreachable => ('API unreachable', Brand.coral),
          },
        );
    return Align(
      alignment: Alignment.centerLeft,
      child: Chip(
        avatar: Icon(Icons.circle, size: 12, color: color),
        label: Text(label),
      ),
    );
  }
}
