import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:prismgo_api/prismgo_api.dart';

import '../../core/api.dart';
import '../../shared/format.dart';
import 'place_field.dart';
import 'requests_providers.dart';

/// New request (no [requestId]) or edit of a draft / pending request.
class RequestFormScreen extends ConsumerWidget {
  const RequestFormScreen({super.key, this.requestId});

  final String? requestId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    if (requestId == null) return const _RequestForm(existing: null);
    return ref
        .watch(requestProvider(requestId!))
        .when(
          data: (r) => _RequestForm(existing: r),
          loading: () =>
              const Scaffold(body: Center(child: CircularProgressIndicator())),
          error: (e, _) => Scaffold(
            appBar: AppBar(),
            body: Center(child: Text(errorMessage(e))),
          ),
        );
  }
}

class _RequestForm extends ConsumerStatefulWidget {
  const _RequestForm({required this.existing});

  final RequestDto? existing;

  @override
  ConsumerState<_RequestForm> createState() => _RequestFormState();
}

class _RequestFormState extends ConsumerState<_RequestForm> {
  late LocationDto? _pickup = widget.existing?.pickup;
  late LocationDto? _drop = widget.existing?.drop;
  late DateTime? _startAt = widget.existing?.startAt.toLocal();
  late DateTime? _returnAt = widget.existing?.returnAt?.toLocal();
  late int _passengers = widget.existing?.passengers.toInt() ?? 1;
  late final _purpose = TextEditingController(text: widget.existing?.purpose);
  late final _notes = TextEditingController(text: widget.existing?.notes);
  String? _error;
  bool _busy = false;

  @override
  void dispose() {
    _purpose.dispose();
    _notes.dispose();
    super.dispose();
  }

  bool get _ready =>
      _pickup != null &&
      _drop != null &&
      _startAt != null &&
      _purpose.text.trim().length >= 3;

  Future<DateTime?> _pickDateTime(DateTime? current) async {
    final now = DateTime.now();
    final initial = current ?? now.add(const Duration(hours: 2));
    final date = await showDatePicker(
      context: context,
      initialDate: initial,
      firstDate: DateTime(now.year, now.month, now.day),
      lastDate: now.add(const Duration(days: 180)),
    );
    if (date == null || !mounted) return null;
    final time = await showTimePicker(
      context: context,
      initialTime: TimeOfDay.fromDateTime(initial),
    );
    if (time == null) return null;
    return DateTime(date.year, date.month, date.day, time.hour, time.minute);
  }

  Future<void> _save({required bool submit}) async {
    if (!_ready) return;
    setState(() {
      _busy = true;
      _error = null;
    });
    final actions = ref.read(requestActionsProvider);
    final notes = _notes.text.trim();
    try {
      // Send UTC: the API runs in UTC and naive times would shift by +5:30.
      final RequestDto saved;
      if (widget.existing == null) {
        saved = await actions.create(
          CreateRequestDto(
            pickup: _pickup!,
            drop: _drop!,
            startAt: _startAt!.toUtc(),
            returnAt: _returnAt?.toUtc(),
            passengers: _passengers,
            purpose: _purpose.text.trim(),
            notes: notes.isEmpty ? null : notes,
            submit: submit,
          ),
        );
      } else {
        saved = await actions.update(
          widget.existing!.id,
          UpdateRequestDto(
            pickup: _pickup,
            drop: _drop,
            startAt: _startAt!.toUtc(),
            returnAt: _returnAt?.toUtc(),
            passengers: _passengers,
            purpose: _purpose.text.trim(),
            notes: notes.isEmpty ? null : notes,
          ),
        );
      }
      if (!mounted) return;
      context.pushReplacement('/requests/${saved.id}');
    } catch (e) {
      setState(() {
        _error = errorMessage(e);
        _busy = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final mine = ref.watch(requestsProvider(myRequestsQuery)).value ?? [];
    final recent = <String, LocationDto>{};
    for (final r in mine) {
      recent.putIfAbsent(r.pickup.address, () => r.pickup);
      recent.putIfAbsent(r.drop.address, () => r.drop);
    }
    final places = recent.values.take(6).toList();
    final editing = widget.existing != null;

    return Scaffold(
      appBar: AppBar(
        title: Text(
          editing ? 'Edit ${widget.existing!.code}' : 'Request a vehicle',
        ),
      ),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.all(20),
          children: [
            PlaceField(
              label: 'Pickup',
              initial: _pickup,
              recent: places,
              onChanged: (p) => setState(() => _pickup = p),
            ),
            const SizedBox(height: 20),
            PlaceField(
              label: 'Drop',
              initial: _drop,
              recent: places,
              onChanged: (p) => setState(() => _drop = p),
            ),
            const SizedBox(height: 20),
            _DateTimeTile(
              label: 'Pickup time',
              value: _startAt,
              onTap: () async {
                final picked = await _pickDateTime(_startAt);
                if (picked != null) setState(() => _startAt = picked);
              },
            ),
            _DateTimeTile(
              label: 'Return time (optional)',
              value: _returnAt,
              onTap: () async {
                final picked = await _pickDateTime(_returnAt ?? _startAt);
                if (picked != null) setState(() => _returnAt = picked);
              },
              onClear: _returnAt == null
                  ? null
                  : () => setState(() => _returnAt = null),
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                const Expanded(child: Text('People')),
                IconButton.outlined(
                  tooltip: 'Fewer people',
                  onPressed: _passengers > 1
                      ? () => setState(() => _passengers--)
                      : null,
                  icon: const Icon(Icons.remove),
                ),
                SizedBox(
                  width: 40,
                  child: Text(
                    '$_passengers',
                    textAlign: TextAlign.center,
                    style: Theme.of(context).textTheme.titleMedium,
                  ),
                ),
                IconButton.outlined(
                  tooltip: 'More people',
                  onPressed: _passengers < 60
                      ? () => setState(() => _passengers++)
                      : null,
                  icon: const Icon(Icons.add),
                ),
              ],
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _purpose,
              decoration: const InputDecoration(
                labelText: 'Purpose',
                hintText: 'Client meeting, airport drop…',
              ),
              onChanged: (_) => setState(() {}),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _notes,
              maxLines: 2,
              decoration: const InputDecoration(
                labelText: 'Notes for transport (optional)',
                hintText: 'Luggage, accessibility, contact on site',
              ),
            ),
            if (_error != null) ...[
              const SizedBox(height: 16),
              Text(
                _error!,
                style: TextStyle(color: Theme.of(context).colorScheme.error),
              ),
            ],
            const SizedBox(height: 24),
            FilledButton(
              onPressed: _busy || !_ready ? null : () => _save(submit: true),
              child: Padding(
                padding: const EdgeInsets.symmetric(vertical: 12),
                child: Text(
                  _busy
                      ? 'Saving…'
                      : editing
                      ? 'Save changes'
                      : 'Submit for approval',
                ),
              ),
            ),
            if (!editing)
              TextButton(
                onPressed: _busy || !_ready ? null : () => _save(submit: false),
                child: const Text('Save as draft'),
              ),
          ],
        ),
      ),
    );
  }
}

class _DateTimeTile extends StatelessWidget {
  const _DateTimeTile({
    required this.label,
    required this.value,
    required this.onTap,
    this.onClear,
  });

  final String label;
  final DateTime? value;
  final VoidCallback onTap;
  final VoidCallback? onClear;

  @override
  Widget build(BuildContext context) {
    return ListTile(
      contentPadding: EdgeInsets.zero,
      leading: const Icon(Icons.schedule),
      title: Text(label),
      subtitle: Text(
        value == null ? 'Choose date and time' : formatDateTime(value!),
      ),
      trailing: onClear == null
          ? const Icon(Icons.chevron_right)
          : IconButton(
              tooltip: 'Clear',
              icon: const Icon(Icons.close),
              onPressed: onClear,
            ),
      onTap: onTap,
    );
  }
}
