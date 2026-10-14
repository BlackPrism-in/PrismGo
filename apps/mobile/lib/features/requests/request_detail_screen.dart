import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:prismgo_api/prismgo_api.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../app/theme.dart';
import '../../core/api.dart';
import '../../core/phone.dart';
import '../../shared/format.dart';
import '../../shared/widgets.dart';
import '../tracking/trip_map.dart';
import 'decision_sheet.dart';
import 'requests_providers.dart';

class RequestDetailScreen extends ConsumerWidget {
  const RequestDetailScreen({super.key, required this.id});

  final String id;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final async = ref.watch(requestProvider(id));
    return Scaffold(
      appBar: AppBar(title: Text(async.value?.code ?? 'Request')),
      body: async.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => EmptyState(
          icon: Icons.error_outline,
          message: errorMessage(e),
          action: OutlinedButton(
            onPressed: () => ref.invalidate(requestProvider(id)),
            child: const Text('Try again'),
          ),
        ),
        data: (r) => RefreshIndicator(
          onRefresh: () => ref.refresh(requestProvider(id).future),
          child: ListView(
            padding: const EdgeInsets.all(16),
            children: [
              Row(
                children: [
                  StatusChip(r.status),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      '${r.requester.name} · ${r.department.name}',
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                ],
              ),
              _ActionsBar(request: r),
              const SizedBox(height: 4),
              if (r.trip != null) _TripCard(trip: r.trip!),
              if (r.trip != null &&
                  (r.status == RequestStatus.assigned ||
                      r.status == RequestStatus.inProgress ||
                      r.status == RequestStatus.completed))
                TripMapCard(tripId: r.trip!.id),
              _DetailsCard(request: r),
              const SizedBox(height: 8),
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'History',
                        style: Theme.of(context).textTheme.titleMedium,
                      ),
                      const SizedBox(height: 12),
                      for (final (i, e) in r.timeline.indexed)
                        _TimelineRow(
                          entry: e,
                          last: i == r.timeline.length - 1,
                        ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _TripCard extends StatelessWidget {
  const _TripCard({required this.trip});

  final TripSummaryDto trip;

  @override
  Widget build(BuildContext context) {
    return Card(
      color: Brand.mintLight,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              trip.vehicle.regNo,
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                fontFamily: 'monospace',
                fontWeight: FontWeight.w600,
              ),
            ),
            Text('${trip.vehicle.type} · ${trip.vehicle.seats} seats'),
            const Divider(height: 24),
            Row(
              children: [
                const CircleAvatar(
                  backgroundColor: Brand.mint,
                  foregroundColor: Brand.ink,
                  child: Icon(Icons.person),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        trip.driver.name,
                        style: Theme.of(context).textTheme.titleSmall,
                      ),
                      Text(formatIndianMobile(trip.driver.phone)),
                    ],
                  ),
                ),
                FilledButton.icon(
                  onPressed: () =>
                      launchUrl(Uri(scheme: 'tel', path: trip.driver.phone)),
                  icon: const Icon(Icons.call),
                  label: const Text('Call'),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _DetailsCard extends StatelessWidget {
  const _DetailsCard({required this.request});

  final RequestDto request;

  @override
  Widget build(BuildContext context) {
    final r = request;
    Widget row(IconData icon, String label, String value) => ListTile(
      dense: true,
      contentPadding: EdgeInsets.zero,
      leading: Icon(icon, color: Brand.sand600),
      title: Text(
        label,
        style: const TextStyle(color: Brand.sand600, fontSize: 12),
      ),
      subtitle: Text(
        value,
        style: const TextStyle(color: Brand.ink, fontSize: 15),
      ),
    );
    return Card(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
        child: Column(
          children: [
            row(Icons.trip_origin, 'Pickup', r.pickup.address),
            row(Icons.place_outlined, 'Drop', r.drop.address),
            row(Icons.schedule, 'Pickup time', formatDateTime(r.startAt)),
            row(
              Icons.keyboard_return,
              'Return',
              r.returnAt == null ? 'One way' : formatDateTime(r.returnAt!),
            ),
            row(Icons.groups_outlined, 'People', '${r.passengers}'),
            row(Icons.notes, 'Purpose', r.purpose),
            if (r.notes != null) row(Icons.info_outline, 'Notes', r.notes!),
            if (r.cancelReason != null)
              row(
                Icons.cancel_outlined,
                'Cancellation reason',
                r.cancelReason!,
              ),
          ],
        ),
      ),
    );
  }
}

/// Buttons for the actions the API says this user may take.
class _ActionsBar extends ConsumerStatefulWidget {
  const _ActionsBar({required this.request});

  final RequestDto request;

  @override
  ConsumerState<_ActionsBar> createState() => _ActionsBarState();
}

class _ActionsBarState extends ConsumerState<_ActionsBar> {
  bool _submitting = false;

  @override
  Widget build(BuildContext context) {
    final r = widget.request;
    bool can(String a) => r.actions.contains(a);
    if (r.actions.isEmpty) return const SizedBox.shrink();

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Wrap(
        spacing: 8,
        runSpacing: 8,
        children: [
          if (can('approve'))
            FilledButton(
              onPressed: () => showDecisionSheet(context, r, Decision.approve),
              child: const Text('Approve'),
            ),
          if (can('reject'))
            OutlinedButton(
              onPressed: () => showDecisionSheet(context, r, Decision.reject),
              child: const Text('Decline'),
            ),
          if (can('submit'))
            FilledButton(
              onPressed: _submitting
                  ? null
                  : () async {
                      setState(() => _submitting = true);
                      try {
                        await ref.read(requestActionsProvider).submit(r.id);
                      } catch (e) {
                        if (context.mounted) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(content: Text(errorMessage(e))),
                          );
                        }
                      } finally {
                        if (mounted) setState(() => _submitting = false);
                      }
                    },
              child: const Text('Submit for approval'),
            ),
          if (can('edit'))
            OutlinedButton(
              onPressed: () => context.push('/requests/${r.id}/edit'),
              child: const Text('Edit'),
            ),
          if (can('cancel'))
            TextButton(
              onPressed: () => showDecisionSheet(context, r, Decision.cancel),
              child: const Text('Cancel trip'),
            ),
        ],
      ),
    );
  }
}

class _TimelineRow extends StatelessWidget {
  const _TimelineRow({required this.entry, required this.last});

  final TimelineEntryDto entry;
  final bool last;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 14),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            margin: const EdgeInsets.only(top: 5),
            width: 10,
            height: 10,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: last ? Brand.coral : Brand.sand300,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  timelineLabel(entry.type),
                  style: const TextStyle(fontWeight: FontWeight.w600),
                ),
                Text(
                  [formatDateTime(entry.at), ?entry.actorName].join(' · '),
                  style: const TextStyle(color: Brand.sand500, fontSize: 13),
                ),
                if (entry.note != null) Text('“${entry.note}”'),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
