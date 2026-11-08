import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../app/logo.dart';
import '../../core/api.dart';
import '../../core/phone.dart';

typedef SignupDepartment = ({String id, String name});

/// Departments a new employee can pick; public, no login needed.
final signupDepartmentsProvider =
    FutureProvider.autoDispose<List<SignupDepartment>>((ref) async {
      final res = await ref
          .read(apiProvider)
          .dio
          .get<List<dynamic>>('/api/v1/access/departments');
      return [
        for (final d in res.data ?? const [])
          (id: d['id'] as String, name: d['name'] as String),
      ];
    });

/// A new employee asks for access. Their HOD approves, then they log in as usual.
class SignupScreen extends ConsumerStatefulWidget {
  const SignupScreen({super.key, this.phone});

  /// Pre-filled from the login screen when they already typed their number.
  final String? phone;

  @override
  ConsumerState<SignupScreen> createState() => _SignupScreenState();
}

class _SignupScreenState extends ConsumerState<SignupScreen> {
  final _name = TextEditingController();
  late final _phone = TextEditingController(text: widget.phone ?? '');
  final _email = TextEditingController();
  String? _departmentId;
  String? _error;
  bool _busy = false;
  bool _done = false;

  @override
  void dispose() {
    _name.dispose();
    _phone.dispose();
    _email.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (_busy) return;
    final phone = normalizeIndianMobile(_phone.text);
    String? error;
    if (_name.text.trim().length < 2) {
      error = 'Enter your full name';
    } else if (phone == null) {
      error = 'Enter a valid 10-digit mobile number';
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
          .read(apiProvider)
          .dio
          .post<void>(
            '/api/v1/access/requests',
            data: {
              'name': _name.text.trim(),
              'phone': phone,
              'departmentId': _departmentId,
              if (_email.text.trim().isNotEmpty) 'email': _email.text.trim(),
            },
          );
      if (mounted) setState(() => _done = true);
    } catch (e) {
      if (mounted) setState(() => _error = errorMessage(e));
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final departments = ref.watch(signupDepartmentsProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Request access')),
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 400),
              child: _done
                  ? Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        const Logo(),
                        const SizedBox(height: 32),
                        Icon(
                          Icons.mark_email_read_outlined,
                          size: 48,
                          color: theme.colorScheme.primary,
                        ),
                        const SizedBox(height: 16),
                        Text(
                          'Request sent',
                          textAlign: TextAlign.center,
                          style: theme.textTheme.titleLarge,
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'Your HOD will review it. Once approved, log in with '
                          '${formatIndianMobile(normalizeIndianMobile(_phone.text) ?? _phone.text)} '
                          "and you'll get a code on WhatsApp.",
                          textAlign: TextAlign.center,
                        ),
                        const SizedBox(height: 24),
                        FilledButton(
                          onPressed: () => context.go('/login'),
                          child: const Text('Back to log in'),
                        ),
                      ],
                    )
                  : Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        Text(
                          'New to PrismGo? Tell us who you are. Your HOD '
                          'approves the request, then you can log in.',
                          style: theme.textTheme.bodyMedium,
                        ),
                        const SizedBox(height: 24),
                        TextField(
                          key: const Key('signup-name'),
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
                        TextField(
                          key: const Key('signup-phone'),
                          controller: _phone,
                          keyboardType: TextInputType.phone,
                          autofillHints: const [AutofillHints.telephoneNumber],
                          textInputAction: TextInputAction.next,
                          decoration: const InputDecoration(
                            labelText: 'Mobile number (WhatsApp)',
                            hintText: '98123 45678',
                            prefixText: '+91 ',
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
                                style: TextStyle(
                                  color: theme.colorScheme.error,
                                ),
                              ),
                              TextButton(
                                onPressed: () =>
                                    ref.invalidate(signupDepartmentsProvider),
                                child: const Text('Try again'),
                              ),
                            ],
                          ),
                          data: (list) => DropdownButtonFormField<String>(
                            key: const Key('signup-department'),
                            initialValue: _departmentId,
                            isExpanded: true,
                            decoration: const InputDecoration(
                              labelText: 'Department',
                              border: OutlineInputBorder(),
                            ),
                            items: [
                              for (final d in list)
                                DropdownMenuItem(
                                  value: d.id,
                                  child: Text(d.name),
                                ),
                            ],
                            onChanged: (v) => setState(() => _departmentId = v),
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
                          onSubmitted: (_) => _submit(),
                        ),
                        const SizedBox(height: 24),
                        FilledButton(
                          onPressed: _busy ? null : _submit,
                          child: Text(_busy ? 'Sending…' : 'Send request'),
                        ),
                        if (_error != null) ...[
                          const SizedBox(height: 12),
                          Text(
                            _error!,
                            key: const Key('signup-error'),
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
