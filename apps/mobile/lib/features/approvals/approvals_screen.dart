import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:prismgo_api/prismgo_api.dart';

import '../../core/api.dart';
import '../../shared/widgets.dart';
import '../requests/decision_sheet.dart';
import '../requests/requests_providers.dart';

class ApprovalsScreen extends ConsumerWidget {
  const ApprovalsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final pending = ref.watch(requestsProvider(pendingApprovalsQuery));
    final all = ref.watch(requestsProvider(departmentRequestsQuery));
    final recent = (all.value ?? [])
        .where((r) => r.status != RequestStatus.pendingApproval)
        .take(20)
        .toList();

    return Scaffold(
      appBar: AppBar(title: const Text('Approvals')),
      body: pending.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => EmptyState(
          icon: Icons.cloud_off_outlined,
          message: errorMessage(e),
          action: OutlinedButton(
            onPressed: () => ref.invalidate(requestsProvider),
            child: const Text('Try again'),
          ),
        ),
        data: (list) => RefreshIndicator(
          onRefresh: () async {
            ref.invalidate(requestsProvider);
            await ref.read(requestsProvider(pendingApprovalsQuery).future);
          },
          child: ListView(
            padding: const EdgeInsets.all(16),
            children: [
              Text(
                'Waiting for you (${list.length})',
                style: Theme.of(context).textTheme.titleSmall,
              ),
              if (list.isEmpty)
                const Padding(
                  padding: EdgeInsets.symmetric(vertical: 24),
                  child: EmptyState(
                    icon: Icons.task_alt,
                    message: "You're all caught up.",
                  ),
                ),
              for (final r in list)
                RequestTile(
                  request: r,
                  showRequester: true,
                  onTap: () => context.push('/requests/${r.id}'),
                  trailing: Row(
                    children: [
                      Expanded(
                        child: FilledButton(
                          onPressed: () =>
                              showDecisionSheet(context, r, Decision.approve),
                          child: const Text('Approve'),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: OutlinedButton(
                          onPressed: () =>
                              showDecisionSheet(context, r, Decision.reject),
                          child: const Text('Decline'),
                        ),
                      ),
                    ],
                  ),
                ),
              if (recent.isNotEmpty) ...[
                const SizedBox(height: 16),
                Text('Recent', style: Theme.of(context).textTheme.titleSmall),
                for (final r in recent)
                  RequestTile(
                    request: r,
                    showRequester: true,
                    onTap: () => context.push('/requests/${r.id}'),
                  ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
