import 'package:flutter_secure_storage/flutter_secure_storage.dart';

/// Keeps tokens in the Keychain (iOS) / Keystore-backed storage (Android).
class TokenStorage {
  TokenStorage([FlutterSecureStorage? storage])
    : _storage = storage ?? const FlutterSecureStorage();

  final FlutterSecureStorage _storage;
  static const _accessKey = 'access_token';
  static const _refreshKey = 'refresh_token';

  String? _accessCache;

  Future<String?> get accessToken async =>
      _accessCache ??= await _storage.read(key: _accessKey);

  Future<String?> get refreshToken => _storage.read(key: _refreshKey);

  Future<void> save({required String access, String? refresh}) async {
    _accessCache = access;
    await _storage.write(key: _accessKey, value: access);
    if (refresh != null) await _storage.write(key: _refreshKey, value: refresh);
  }

  Future<void> clear() async {
    _accessCache = null;
    await _storage.delete(key: _accessKey);
    await _storage.delete(key: _refreshKey);
  }
}
