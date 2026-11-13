import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/api.dart';
import 'session_controller.dart';

typedef _Department = ({String id, String name});

final _departmentsProvider = FutureProvider.autoDispose<List<_Department>>((
  ref,
) async {
  final res = await ref
      .read(apiProvider)
      .dio
      .get<List<dynamic>>('/api/v1/departments');
  return [
    for (final d in res.data ?? const [])
      (id: d['id'] as String, name: d['name'] as String),
  ];
});

/// Shown once after a new number's first login: their name and department.
class ProfileScreen extends ConsumerStatefulWidget {
  const ProfileScreen({super.key});

  @override
  ConsumerState<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends ConsumerState<ProfileScreen> {
  late final _name = TextEditingController(
    text: ref.read(sessionControllerProvider).value?.name ?? '',
  );
  final _email = TextEditingController();
  late String? _departmentId = ref
      .read(sessionControllerProvider)
      .value
      ?.department
      ?.id;
  String? _error;
  bool _busy = false;

  @override
  void dispose() {
    _name.dispose();
    _email.dispose();
    super.dispose();
  }

  Future<void> _save() async {
    if (_busy) return;
    String? error;
    if (_name.text.trim().length < 2) {
      error = 'Enter your full name';
    } else if (_departmentId == null) {
      error = 'Choose your department';
    }
    if (error != null) {
      setState(() => _error = error);
      return;
    }
    setState(() {
      _busy = true;
      _error = null;
    });
    try {
      await ref
          .read(sessionControllerProvider.notifier)
          .saveProfile(
            name: _name.text.trim(),
            departmentId: _departmentId!,
            email: _email.text.trim(),
          );
      // The router moves on once the profile is complete.
    } catch (e) {
      if (mounted) {
        setState(() {
          _error = errorMessage(e);
          _busy = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final departments = ref.watch(_departmentsProvider);
    final hasDepartment =
        ref.watch(sessionControllerProvider).value?.department != null;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Welcome to PrismGo'),
        actions: [
          TextButton(
            onPressed: () =>
                ref.read(sessionControllerProvider.notifier).logout(),
            child: const Text('Log out'),
          ),
        ],
      ),
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 400),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Text(
                    "Tell us your name and department. Your trip requests "
                    "go to that department's HOD.",
                    style: theme.textTheme.bodyMedium,
                  ),
                  const SizedBox(height: 24),
                  TextField(
                    key: const Key('profile-name'),
                    controller: _name,
                    textCapitalization: TextCapitalization.words,
                    autofillHints: const [AutofillHints.name],
                    textInputAction: TextInputAction.next,
                    decoration: const InputDecoration(
                      labelText: 'Full name',
                      border: OutlineInputBorder(),
                    ),
                  ),
                  const SizedBox(height: 16),
                  departments.when(
                    loading: () => const LinearProgressIndicator(),
                    error: (e, _) => Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        Text(
                          errorMessage(e),
                          style: TextStyle(color: theme.colorScheme.error),
                        ),
                        TextButton(
                          onPressed: () => ref.invalidate(_departmentsProvider),
                          child: const Text('Try again'),
                        ),
                      ],
                    ),
                    data: (list) => DropdownButtonFormField<String>(
                      key: const Key('profile-department'),
                      initialValue: _departmentId,
                      isExpanded: true,
                      decoration: const InputDecoration(
                        labelText: 'Department',
                        border: OutlineInputBorder(),
                      ),
                      items: [
                        for (final d in list)
                          DropdownMenuItem(value: d.id, child: Text(d.name)),
                      ],
                      onChanged: hasDepartment
                          ? null
                          : (v) => setState(() => _departmentId = v),
                    ),
                  ),
                  const SizedBox(height: 16),
                  TextField(
                    controller: _email,
                    keyboardType: TextInputType.emailAddress,
                    autofillHints: const [AutofillHints.email],
                    textInputAction: TextInputAction.done,
                    decoration: const InputDecoration(
                      labelText: 'Work email (optional)',
                      border: OutlineInputBorder(),
                    ),
                    onSubmitted: (_) => _save(),
                  ),
                  const SizedBox(height: 24),
                  FilledButton(
                    key: const Key('profile-save'),
                    onPressed: _busy ? null : _save,
                    child: Text(_busy ? 'Saving…' : 'Continue'),
                  ),
                  if (_error != null) ...[
                    const SizedBox(height: 12),
                    Text(
                      _error!,
                      style: TextStyle(color: theme.colorScheme.error),
                    ),
                  ],
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
