import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../features/approvals/approvals_screen.dart';
import '../features/auth/login_screen.dart';
import '../features/auth/offline_screen.dart';
import '../features/auth/session_controller.dart';
import '../features/auth/profile_screen.dart';
import '../features/auth/signup_screen.dart';
import '../features/home/home_screen.dart';
import '../features/notifications/notifications_screen.dart';
import '../features/requests/request_detail_screen.dart';
import '../features/requests/request_form_screen.dart';
import '../features/requests/requests_screen.dart';
import 'shell.dart';

/// Rebuilds routing whenever the session changes (login, logout, expiry).
final routerProvider = Provider<GoRouter>((ref) {
  final refresh = ValueNotifier(0);
  ref.listen(sessionControllerProvider, (_, _) => refresh.value++);
  ref.onDispose(refresh.dispose);

  return GoRouter(
    refreshListenable: refresh,
    redirect: (context, state) {
      final session = ref.read(sessionControllerProvider);
      if (session.isLoading) return '/splash';
      if (session.hasError) return '/offline';
      final loggedIn = session.value != null;
      final at = state.matchedLocation;
      const publicPages = {'/login', '/signup'};
      if (!loggedIn) return publicPages.contains(at) ? null : '/login';
      if (needsProfile(session.value!)) {
        return at == '/profile' ? null : '/profile';
      }
      if (publicPages.contains(at) ||
          at == '/splash' ||
          at == '/offline' ||
          at == '/profile') {
        return '/';
      }
      return null;
    },
    routes: [
      GoRoute(
        path: '/splash',
        builder: (context, state) =>
            const Scaffold(body: Center(child: CircularProgressIndicator())),
      ),
      GoRoute(path: '/login', builder: (context, state) => const LoginScreen()),
      GoRoute(
        path: '/profile',
        builder: (context, state) => const ProfileScreen(),
      ),
      GoRoute(
        path: '/signup',
        builder: (context, state) =>
            SignupScreen(phone: state.extra as String?),
      ),
      GoRoute(
        path: '/offline',
        builder: (context, state) => const OfflineScreen(),
      ),
      ShellRoute(
        builder: (context, state, child) =>
            AppShell(location: state.matchedLocation, child: child),
        routes: [
          GoRoute(
            path: '/',
            builder: (context, state) => Consumer(
              builder: (context, ref, _) {
                final me = ref.watch(sessionControllerProvider).value;
                return me == null
                    ? const SizedBox.shrink()
                    : HomeScreen(me: me);
              },
            ),
          ),
          GoRoute(
            path: '/requests',
            builder: (context, state) => const RequestsScreen(),
          ),
          GoRoute(
            path: '/approvals',
            builder: (context, state) => const ApprovalsScreen(),
          ),
          GoRoute(
            path: '/notifications',
            builder: (context, state) => const NotificationsScreen(),
          ),
        ],
      ),
      // Full-screen pages pushed over the tabs.
      GoRoute(
        path: '/requests/new',
        builder: (context, state) => const RequestFormScreen(),
      ),
      GoRoute(
        path: '/requests/:id',
        builder: (context, state) =>
            RequestDetailScreen(id: state.pathParameters['id']!),
      ),
      GoRoute(
        path: '/requests/:id/edit',
        builder: (context, state) =>
            RequestFormScreen(requestId: state.pathParameters['id']),
      ),
    ],
  );
});
