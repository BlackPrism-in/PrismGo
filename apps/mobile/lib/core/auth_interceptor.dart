import 'package:dio/dio.dart';
import 'package:prismgo_api/prismgo_api.dart';

import 'token_storage.dart';

/// Adds the bearer token and, on a 401, refreshes once and retries.
/// QueuedInterceptor runs one request's handlers at a time, so concurrent 401s
/// wait for a single refresh instead of racing (which would trip reuse detection).
class AuthInterceptor extends QueuedInterceptor {
  AuthInterceptor({
    required this.tokens,
    required this.refreshClient,
    required this.onSessionExpired,
  });

  final TokenStorage tokens;

  /// A Dio without this interceptor, used for the refresh call and retries.
  final Dio refreshClient;
  final void Function() onSessionExpired;

  static const _noAuthPaths = ['/api/v1/auth/otp/', '/api/v1/auth/refresh'];

  bool _skip(RequestOptions o) => _noAuthPaths.any(o.path.startsWith);

  @override
  Future<void> onRequest(
    RequestOptions options,
    RequestInterceptorHandler handler,
  ) async {
    if (!_skip(options)) {
      final token = await tokens.accessToken;
      if (token != null) options.headers['Authorization'] = 'Bearer $token';
    }
    handler.next(options);
  }

  @override
  Future<void> onError(
    DioException err,
    ErrorInterceptorHandler handler,
  ) async {
    final request = err.requestOptions;
    if (err.response?.statusCode != 401 || _skip(request)) {
      return handler.next(err);
    }

    // Another queued request may already have refreshed.
    final sent = request.headers['Authorization'];
    final current = await tokens.accessToken;
    if (current != null && sent != 'Bearer $current') {
      return _retry(request, current, handler, err);
    }

    final refresh = await tokens.refreshToken;
    if (refresh == null) return _expire(handler, err);
    try {
      final res = await refreshClient.post<Map<String, dynamic>>(
        '/api/v1/auth/refresh',
        data: RefreshDto(refreshToken: refresh).toJson(),
      );
      final data = res.data!;
      await tokens.save(
        access: data['accessToken'] as String,
        refresh: data['refreshToken'] as String?,
      );
      return _retry(request, data['accessToken'] as String, handler, err);
    } on DioException catch (e) {
      // Only a rejected refresh token ends the session. Network errors and
      // server outages keep it, so the user isn't logged out by a bad signal.
      final status = e.response?.statusCode;
      if (status == 401 || status == 403) return _expire(handler, err);
      return handler.next(err);
    }
  }

  Future<void> _retry(
    RequestOptions request,
    String token,
    ErrorInterceptorHandler handler,
    DioException original,
  ) async {
    try {
      request.headers['Authorization'] = 'Bearer $token';
      handler.resolve(await refreshClient.fetch(request));
    } on DioException catch (e) {
      handler.next(e);
    } catch (_) {
      handler.next(original);
    }
  }

  Future<void> _expire(
    ErrorInterceptorHandler handler,
    DioException err,
  ) async {
    await tokens.clear();
    onSessionExpired();
    handler.next(err);
  }
}
