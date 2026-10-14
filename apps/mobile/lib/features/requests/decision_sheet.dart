import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:prismgo_api/prismgo_api.dart';

import '../../core/api.dart';
import 'requests_providers.dart';

enum Decision { approve, reject, cancel }

/// Bottom sheet for approve / decline (HOD) and cancel, with an optional or
/// required note. Returns the updated request, or null if dismissed.
Future<RequestDto?> showDecisionSheet(
  BuildContext context,
  RequestDto request,
  Decision decision,
) {
  return showModalBottomSheet<RequestDto>(
    context: context,
    // Above the bottom navigation bar, not inside the tab's navigator.
    useRootNavigator: true,
    isScrollControlled: true,
    showDragHandle: true,
    builder: (_) => _DecisionSheet(request: request, decision: decision),
  );
}

class _DecisionSheet extends ConsumerStatefulWidget {
  const _DecisionSheet({required this.request, required this.decision});

  final RequestDto request;
  final Decision decision;

  @override
  ConsumerState<_DecisionSheet> createState() => _DecisionSheetState();
}

class _DecisionSheetState extends ConsumerState<_DecisionSheet> {
  final _text = TextEditingController();
  bool _busy = false;
  String? _error;

  @override
  void dispose() {
    _text.dispose();
    super.dispose();
  }

  (String title, String label, String button, bool required) get _copy =>
      switch (widget.decision) {
        Decision.approve => (
          'Approve ${widget.request.code}',
          'Comment (optional)',
          'Approve',
          false,
        ),
        Decision.reject => (
          'Decline ${widget.request.code}',
          'Reason (the requester sees this)',
          'Decline',
          true,
        ),
        Decision.cancel => (
          'Cancel ${widget.request.code}',
          'Reason (optional)',
          'Cancel trip',
          false,
        ),
      };

  Future<void> _submit() async {
    setState(() {
      _busy = true;
      _error = null;
    });
    final actions = ref.read(requestActionsProvider);
    final text = _text.text.trim();
    final note = text.isEmpty ? null : text;
    try {
      final updated = switch (widget.decision) {
        Decision.approve => await actions.approve(widget.request.id, note),
        Decision.reject => await actions.reject(widget.request.id, text),
        Decision.cancel => await actions.cancel(widget.request.id, note),
      };
      if (mounted) Navigator.of(context).pop(updated);
    } catch (e) {
      setState(() {
        _error = errorMessage(e);
        _busy = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final (title, label, button, required) = _copy;
    final destructive = widget.decision != Decision.approve;
    final canSubmit = !_busy && (!required || _text.text.trim().length >= 3);
    final r = widget.request;

    return Padding(
      padding: EdgeInsets.fromLTRB(
        20,
        0,
        20,
        20 + MediaQuery.viewInsetsOf(context).bottom,
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Text(title, style: Theme.of(context).textTheme.titleLarge),
          const SizedBox(height: 4),
          Text('${r.requester.name} · ${r.pickup.address} → ${r.drop.address}'),
          const SizedBox(height: 16),
          TextField(
            key: const Key('decision-text'),
            controller: _text,
            autofocus: true,
            maxLines: 2,
            decoration: InputDecoration(labelText: label),
            onChanged: (_) => setState(() {}),
          ),
          if (_error != null) ...[
            const SizedBox(height: 8),
            Text(
              _error!,
              style: TextStyle(color: Theme.of(context).colorScheme.error),
            ),
          ],
          const SizedBox(height: 16),
          FilledButton(
            style: destructive
                ? FilledButton.styleFrom(
                    backgroundColor: Theme.of(context).colorScheme.error,
                    foregroundColor: Theme.of(context).colorScheme.onError,
                  )
                : null,
            onPressed: canSubmit ? _submit : null,
            child: Text(_busy ? 'Saving…' : button),
          ),
        ],
      ),
    );
  }
}
