import 'package:flutter/material.dart';
import 'package:prismgo_api/prismgo_api.dart';

import '../app/theme.dart';
import 'format.dart';

/// Status pill. Colours follow the web app: amber waiting, mint assigned, red declined.
class StatusChip extends StatelessWidget {
  const StatusChip(this.status, {super.key});

  final RequestStatus status;

  @override
  Widget build(BuildContext context) {
    final (bg, fg) = switch (status) {
      RequestStatus.pendingApproval => (
        const Color(0xFFFFF1CC),
        const Color(0xFF7A4D00),
      ),
      RequestStatus.approved => (Brand.coralLight, Brand.ink),
      RequestStatus.rejected => (
        const Color(0xFFFDE2E1),
        const Color(0xFF9B1C1C),
      ),
      RequestStatus.assigned ||
      RequestStatus.inProgress => (Brand.mintLight, Brand.mintText),
      _ => (Brand.sand200, Brand.sand600),
    };
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(999),
      ),
      child: Text(
        statusLabel(status),
        style: TextStyle(color: fg, fontSize: 12, fontWeight: FontWeight.w600),
      ),
    );
  }
}

/// Centered message with an optional action, for empty and error states.
class EmptyState extends StatelessWidget {
  const EmptyState({
    super.key,
    required this.icon,
    required this.message,
    this.action,
  });

  final IconData icon;
  final String message;
  final Widget? action;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, size: 40, color: Brand.sand500),
            const SizedBox(height: 12),
            Text(
              message,
              textAlign: TextAlign.center,
              style: const TextStyle(color: Brand.sand600),
            ),
            if (action != null) ...[const SizedBox(height: 16), action!],
          ],
        ),
      ),
    );
  }
}

/// One request in a list.
class RequestTile extends StatelessWidget {
  const RequestTile({
    super.key,
    required this.request,
    required this.onTap,
    this.showRequester = false,
    this.trailing,
  });

  final RequestDto request;
  final VoidCallback onTap;
  final bool showRequester;
  final Widget? trailing;

  @override
  Widget build(BuildContext context) {
    final r = request;
    final theme = Theme.of(context);
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 6),
      child: InkWell(
        borderRadius: BorderRadius.circular(12),
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(14),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Text(
                    r.code,
                    style: const TextStyle(
                      fontFamily: 'monospace',
                      fontSize: 12,
                      color: Brand.sand500,
                    ),
                  ),
                  const SizedBox(width: 8),
                  StatusChip(r.status),
                ],
              ),
              const SizedBox(height: 8),
              Text(
                formatDateTime(r.startAt),
                style: theme.textTheme.titleSmall,
              ),
              const SizedBox(height: 2),
              Text(
                '${r.pickup.address} → ${r.drop.address}',
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
              const SizedBox(height: 4),
              Text(
                [
                  if (showRequester) r.requester.name,
                  '${r.passengers} ${r.passengers == 1 ? 'person' : 'people'}',
                  r.purpose,
                  if (r.trip != null) r.trip!.vehicle.regNo,
                ].join(' · '),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: theme.textTheme.bodySmall?.copyWith(
                  color: Brand.sand600,
                ),
              ),
              if (trailing != null) ...[const SizedBox(height: 10), trailing!],
            ],
          ),
        ),
      ),
    );
  }
}
