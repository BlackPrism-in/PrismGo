import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:prismgo_api/prismgo_api.dart';

import '../../core/api.dart';
import '../../shared/widgets.dart';
import 'requests_providers.dart';

const _active = {
  RequestStatus.draft,
  RequestStatus.pendingApproval,
  RequestStatus.approved,
  RequestStatus.assigned,
  RequestStatus.inProgress,
};

class RequestsScreen extends ConsumerWidget {
  const RequestsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final async = ref.watch(requestsProvider(myRequestsQuery));
    return Scaffold(
      appBar: AppBar(title: const Text('My requests')),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => context.push('/requests/new'),
        icon: const Icon(Icons.add),
        label: const Text('New request'),
      ),
      body: async.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => EmptyState(
          icon: Icons.cloud_off_outlined,
          message: errorMessage(e),
          action: OutlinedButton(
            onPressed: () => ref.invalidate(requestsProvider),
            child: const Text('Try again'),
          ),
        ),
        data: (list) {
          if (list.isEmpty) {
            return const EmptyState(
              icon: Icons.directions_car_outlined,
              message: 'No requests yet.\nTap "New request" to book a vehicle.',
            );
          }
          // Upcoming soonest first; past newest first (the API order).
          final active = list.where((r) => _active.contains(r.status)).toList()
            ..sort((a, b) => a.startAt.compareTo(b.startAt));
          final past = list.where((r) => !_active.contains(r.status)).toList();
          return RefreshIndicator(
            onRefresh: () =>
                ref.refresh(requestsProvider(myRequestsQuery).future),
            child: ListView(
              padding: const EdgeInsets.fromLTRB(16, 8, 16, 96),
              children: [
                if (active.isNotEmpty)
                  const _Heading('Upcoming and in progress'),
                for (final r in active)
                  RequestTile(
                    request: r,
                    onTap: () => context.push('/requests/${r.id}'),
                  ),
                if (past.isNotEmpty) const _Heading('Past'),
                for (final r in past)
                  RequestTile(
                    request: r,
                    onTap: () => context.push('/requests/${r.id}'),
                  ),
              ],
            ),
          );
        },
      ),
    );
  }
}

class _Heading extends StatelessWidget {
  const _Heading(this.text);

  final String text;

  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.fromLTRB(4, 16, 4, 4),
    child: Text(text, style: Theme.of(context).textTheme.titleSmall),
  );
}
