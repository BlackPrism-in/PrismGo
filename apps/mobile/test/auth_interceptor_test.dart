import 'dart:convert';
import 'dart:typed_data';

import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:prismgo/core/auth_interceptor.dart';
import 'package:prismgo/core/token_storage.dart';

/// Answers requests from a handler and records what was sent.
class FakeAdapter implements HttpClientAdapter {
  FakeAdapter(this.handler);

  final ResponseBody Function(RequestOptions options) handler;
  final requests = <RequestOptions>[];

  @override
  Future<ResponseBody> fetch(
    RequestOptions options,
    Stream<Uint8List>? requestStream,
    Future<void>? cancelFuture,
  ) async {
    requests.add(options);
    return handler(options);
  }

  @override
  void close({bool force = false}) {}
}

ResponseBody json(int status, Object body) => ResponseBody.fromString(
  jsonEncode(body),
  status,
  headers: {
    Headers.contentTypeHeader: [Headers.jsonContentType],
  },
);

void main() {
  late TokenStorage tokens;
  late bool expired;

  setUp(() {
    FlutterSecureStorage.setMockInitialValues({});
    tokens = TokenStorage();
    expired = false;
  });

  Dio build(FakeAdapter adapter) {
    final refreshClient = Dio()..httpClientAdapter = adapter;
    return Dio()
      ..httpClientAdapter = adapter
      ..interceptors.add(
        AuthInterceptor(
          tokens: tokens,
          refreshClient: refreshClient,
          onSessionExpired: () => expired = true,
        ),
      );
  }

  test('refreshes on 401 and retries with the new token', () async {
    await tokens.save(access: 'old', refresh: 'r1');
    final adapter = FakeAdapter((o) {
      if (o.path == '/api/v1/auth/refresh') {
        return json(200, {
          'accessToken': 'new',
          'refreshToken': 'r2',
          'expiresIn': 900,
        });
      }
      return o.headers['Authorization'] == 'Bearer new'
          ? json(200, {'ok': true})
          : json(401, {'message': 'Unauthorized'});
    });

    final res = await build(
      adapter,
    ).get<Map<String, dynamic>>('/api/v1/auth/me');

    expect(res.data, {'ok': true});
    expect(await tokens.accessToken, 'new');
    expect(await tokens.refreshToken, 'r2');
    expect(adapter.requests.map((r) => r.path), [
      '/api/v1/auth/me',
      '/api/v1/auth/refresh',
      '/api/v1/auth/me',
    ]);
    expect(expired, isFalse);
  });

  test('clears tokens and expires the session when refresh fails', () async {
    await tokens.save(access: 'old', refresh: 'r1');
    final adapter = FakeAdapter(
      (o) => json(401, {'message': 'Session expired'}),
    );

    await expectLater(
      build(adapter).get('/api/v1/vehicles'),
      throwsA(isA<DioException>()),
    );
    expect(expired, isTrue);
    expect(await tokens.refreshToken, isNull);
  });

  test(
    'keeps the session when the refresh call fails for network reasons',
    () async {
      await tokens.save(access: 'old', refresh: 'r1');
      final adapter = FakeAdapter((o) {
        if (o.path == '/api/v1/auth/refresh') {
          return json(502, {'message': 'Bad Gateway'});
        }
        return json(401, {});
      });

      await expectLater(
        build(adapter).get('/api/v1/vehicles'),
        throwsA(isA<DioException>()),
      );
      expect(expired, isFalse);
      expect(await tokens.refreshToken, 'r1');
    },
  );

  test('concurrent 401s share a single refresh', () async {
    await tokens.save(access: 'old', refresh: 'r1');
    var refreshCalls = 0;
    final adapter = FakeAdapter((o) {
      if (o.path == '/api/v1/auth/refresh') {
        refreshCalls++;
        return json(200, {
          'accessToken': 'new',
          'refreshToken': 'r2',
          'expiresIn': 900,
        });
      }
      return o.headers['Authorization'] == 'Bearer new'
          ? json(200, {'ok': true})
          : json(401, {});
    });
    final dio = build(adapter);

    await Future.wait([
      dio.get('/api/v1/a'),
      dio.get('/api/v1/b'),
      dio.get('/api/v1/c'),
    ]);
    expect(refreshCalls, 1);
  });

  test('does not attach tokens or refresh on login calls', () async {
    await tokens.save(access: 'old', refresh: 'r1');
    final adapter = FakeAdapter(
      (o) => json(401, {'message': 'Incorrect code'}),
    );

    await expectLater(
      build(adapter).post('/api/v1/auth/otp/verify', data: {}),
      throwsA(isA<DioException>()),
    );
    expect(adapter.requests.single.headers['Authorization'], isNull);
    expect(expired, isFalse);
  });
}
