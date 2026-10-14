import 'dart:io' show Platform;

/// API server origin (the generated client adds `/api/v1/...`). Override per build:
///   flutter run --dart-define=API_ORIGIN=https://api.prismgo.example
///
/// Defaults reach the local API from emulators: Android maps the host to
/// 10.0.2.2, the iOS simulator shares the host's localhost.
class AppConfig {
  static const _fromEnv = String.fromEnvironment('API_ORIGIN');

  static String get apiOrigin {
    if (_fromEnv.isNotEmpty) return _fromEnv;
    final host = Platform.isAndroid ? '10.0.2.2' : 'localhost';
    return 'http://$host:4000';
  }
}
