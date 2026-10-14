import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../app/logo.dart';
import '../../app/theme.dart';
import '../../core/api.dart';
import '../../core/phone.dart';
import 'session_controller.dart';

class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key});

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen> {
  final _phone = TextEditingController();
  final _code = TextEditingController();
  String? _sentTo;
  String? _devCode;
  String? _error;
  bool _busy = false;

  @override
  void dispose() {
    _phone.dispose();
    _code.dispose();
    super.dispose();
  }

  Future<void> _sendCode() async {
    final phone = normalizeIndianMobile(_phone.text);
    if (phone == null) {
      setState(() => _error = 'Enter a valid 10-digit mobile number');
      return;
    }
    setState(() {
      _busy = true;
      _error = null;
    });
    try {
      final devCode = await ref
          .read(sessionControllerProvider.notifier)
          .requestCode(phone);
      setState(() {
        _sentTo = phone;
        _devCode = devCode;
        _code.clear();
      });
    } catch (e) {
      setState(() => _error = errorMessage(e));
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  Future<void> _verify() async {
    if (_code.text.length != 6 || _sentTo == null) return;
    setState(() {
      _busy = true;
      _error = null;
    });
    try {
      await ref
          .read(sessionControllerProvider.notifier)
          .verifyCode(_sentTo!, _code.text);
      // The router redirects home once the session is set.
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
    final codeStep = _sentTo != null;

    return Scaffold(
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 400),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  const Logo(),
                  const SizedBox(height: 4),
                  Text(
                    'Vehicle requests and live tracking',
                    textAlign: TextAlign.center,
                    style: theme.textTheme.bodyMedium,
                  ),
                  const SizedBox(height: 40),
                  if (!codeStep) ...[
                    Text('Log in', style: theme.textTheme.titleLarge),
                    const SizedBox(height: 16),
                    TextField(
                      key: const Key('phone'),
                      controller: _phone,
                      keyboardType: TextInputType.phone,
                      autofillHints: const [AutofillHints.telephoneNumber],
                      decoration: const InputDecoration(
                        labelText: 'Mobile number',
                        hintText: '98123 45678',
                        prefixText: '+91 ',
                        helperText: "We'll send a 6-digit code on WhatsApp",
                        border: OutlineInputBorder(),
                      ),
                      onSubmitted: (_) => _sendCode(),
                    ),
                    const SizedBox(height: 16),
                    FilledButton(
                      onPressed: _busy ? null : _sendCode,
                      child: Text(_busy ? 'Sending…' : 'Send code'),
                    ),
                  ] else ...[
                    Text('Enter code', style: theme.textTheme.titleLarge),
                    const SizedBox(height: 8),
                    Text(
                      'If ${formatIndianMobile(_sentTo!)} is registered, '
                      'a code is on its way.',
                    ),
                    if (_devCode != null) ...[
                      const SizedBox(height: 12),
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: Brand.mintLight,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text('Test code: $_devCode'),
                      ),
                    ],
                    const SizedBox(height: 16),
                    TextField(
                      key: const Key('code'),
                      controller: _code,
                      autofocus: true,
                      keyboardType: TextInputType.number,
                      autofillHints: const [AutofillHints.oneTimeCode],
                      maxLength: 6,
                      textAlign: TextAlign.center,
                      style: const TextStyle(fontSize: 24, letterSpacing: 12),
                      inputFormatters: [FilteringTextInputFormatter.digitsOnly],
                      decoration: const InputDecoration(
                        labelText: '6-digit code',
                        counterText: '',
                        border: OutlineInputBorder(),
                      ),
                      onChanged: (v) {
                        setState(() {});
                        if (v.length == 6) _verify();
                      },
                    ),
                    const SizedBox(height: 16),
                    FilledButton(
                      onPressed: _busy || _code.text.length != 6
                          ? null
                          : _verify,
                      child: Text(_busy ? 'Checking…' : 'Log in'),
                    ),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        TextButton(
                          onPressed: _busy
                              ? null
                              : () => setState(() {
                                  _sentTo = null;
                                  _error = null;
                                }),
                          child: const Text('Change number'),
                        ),
                        TextButton(
                          onPressed: _busy ? null : _sendCode,
                          child: const Text('Resend code'),
                        ),
                      ],
                    ),
                  ],
                  if (_error != null) ...[
                    const SizedBox(height: 12),
                    Text(
                      _error!,
                      key: const Key('error'),
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
