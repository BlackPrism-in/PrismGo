import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:prismgo_api/prismgo_api.dart';

import '../features/auth/session_controller.dart';
import 'auth_interceptor.dart';
import 'config.dart';
import 'token_storage.dart';

final tokenStorageProvider = Provider<TokenStorage>((ref) => TokenStorage());

Dio _baseDio() => Dio(
  BaseOptions(
    baseUrl: AppConfig.apiOrigin,
    connectTimeout: const Duration(seconds: 10),
    receiveTimeout: const Duration(seconds: 15),
  ),
);

/// Generated PrismGo client wired with token handling.
final apiProvider = Provider<PrismgoApi>((ref) {
  final dio = _baseDio();
  dio.interceptors.add(
    AuthInterceptor(
      tokens: ref.watch(tokenStorageProvider),
      refreshClient: _baseDio(),
      onSessionExpired: () =>
          ref.read(sessionControllerProvider.notifier).expire(),
    ),
  );
  return PrismgoApi(dio: dio, interceptors: const []);
});

/// Turns API errors into a sentence for the UI.
String errorMessage(Object error) {
  if (error is DioException) {
    final data = error.response?.data;
    if (data is Map && data['message'] != null) {
      final m = data['message'];
      return m is List ? m.join('. ') : m.toString();
    }
    if (error.type == DioExceptionType.connectionError ||
        error.type == DioExceptionType.connectionTimeout) {
      return "Can't reach PrismGo. Check your connection.";
    }
  }
  return 'Something went wrong. Try again.';
}
