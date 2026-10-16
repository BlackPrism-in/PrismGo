import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'app/router.dart';
import 'app/theme.dart';
import 'core/push.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  final push = await initPush();
  runApp(
    ProviderScope(
      overrides: [pushAvailableProvider.overrideWithValue(push)],
      child: const PrismGoApp(),
    ),
  );
}

class PrismGoApp extends ConsumerWidget {
  const PrismGoApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return MaterialApp.router(
      title: 'PrismGo',
      theme: appTheme,
      routerConfig: ref.watch(routerProvider),
      debugShowCheckedModeBanner: false,
    );
  }
}
