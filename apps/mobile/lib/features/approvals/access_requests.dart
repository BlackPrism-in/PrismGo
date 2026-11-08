import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/api.dart';
import '../../core/phone.dart';

typedef AccessRequest = ({
  String id,
  String name,
  String phone,
  String? department,
});

/// New employees who asked for access and are waiting for this HOD.
final accessRequestsProvider = FutureProvider.autoDispose<List<AccessRequest>>((
  ref,
) async {
  final res = await ref
      .read(apiProvider)
      .dio
      .get<List<dynamic>>('/api/v1/access/requests');
  return [
    for (final r in res.data ?? const [])
      (
        id: r['id'] as String,
        name: r['name'] as String,
        phone: r['phone'] as String,
        department: (r['department'] as Map?)?['name'] as String?,
      ),
  ];
});

/// Shown above trip approvals; hidden when nobody is waiting.
class AccessRequestsSection extends ConsumerStatefulWidget {
  const AccessRequestsSection({super.key});

  @override
  ConsumerState<AccessRequestsSection> createState() =>
      _AccessRequestsSectionState();
}

class _AccessRequestsSectionState extends ConsumerState<AccessRequestsSection> {
  String? _busyId;

  Future<void> _decide(AccessRequest r, {required bool approve}) async {
    if (!approve) {
      final ok = await showDialog<bool>(
        context: context,
        builder: (context) => AlertDialog(
          title: Text('Decline ${r.name}?'),
          content: const Text('They will not be able to log in.'),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context, false),
              child: const Text('Cancel'),
            ),
            FilledButton(
              onPressed: () => Navigator.pop(context, true),
              child: const Text('Decline'),
            ),
          ],
        ),
      );
      if (ok != true) return;
    }
    setState(() => _busyId = r.id);
    try {
      await ref
          .read(apiProvider)
          .dio
          .post<void>(
            '/api/v1/access/requests/${r.id}/${approve ? 'approve' : 'reject'}',
          );
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              approve
                  ? '${r.name} can now log in.'
                  : '${r.name}\'s request was declined.',
            ),
          ),
        );
      }
      ref.invalidate(accessRequestsProvider);
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text(errorMessage(e))));
      }
    } finally {
      if (mounted) setState(() => _busyId = null);
    }
  }

  @override
  Widget build(BuildContext context) {
    final list = ref.watch(accessRequestsProvider).value ?? const [];
    if (list.isEmpty) return const SizedBox.shrink();
    final theme = Theme.of(context);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Text(
          'New people asking for access (${list.length})',
          style: theme.textTheme.titleSmall,
        ),
        for (final r in list)
          Card(
            margin: const EdgeInsets.symmetric(vertical: 6),
            child: Padding(
              padding: const EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Text(r.name, style: theme.textTheme.titleMedium),
                  Text(
                    [
                      formatIndianMobile(r.phone),
                      if (r.department != null) r.department!,
                    ].join(' · '),
                    style: theme.textTheme.bodySmall,
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      Expanded(
                        child: FilledButton(
                          onPressed: _busyId == r.id
                              ? null
                              : () => _decide(r, approve: true),
                          child: const Text('Approve'),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: OutlinedButton(
                          onPressed: _busyId == r.id
                              ? null
                              : () => _decide(r, approve: false),
                          child: const Text('Decline'),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        const SizedBox(height: 16),
      ],
    );
  }
}
