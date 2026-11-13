import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:prismgo_api/prismgo_api.dart';

import '../../core/api.dart';
import '../../core/push.dart';

/// The signed-in user, or null when logged out. Loading while restoring at launch.
class SessionController extends AsyncNotifier<MeDto?> {
  @override
  Future<MeDto?> build() async {
    final tokens = ref.read(tokenStorageProvider);
    if (await tokens.refreshToken == null) return null;
    try {
      // Goes through the interceptor, which refreshes an expired access token.
      final res = await ref.read(apiProvider).getAuthApi().authControllerMe();
      return res.data;
    } on DioException catch (e) {
      final status = e.response?.statusCode;
      if (status == 401 || status == 403) {
        await tokens.clear();
        return null;
      }
      // API unreachable: keep the tokens and surface an error the UI can retry.
      rethrow;
    }
  }

  /// Returns the development code when the API uses the console sender.
  Future<String?> requestCode(String phone) async {
    final res = await ref
        .read(apiProvider)
        .getAuthApi()
        .authControllerRequestOtp(requestOtpDto: RequestOtpDto(phone: phone));
    return res.data?.devCode;
  }

  Future<void> verifyCode(String phone, String code) async {
    final res = await ref
        .read(apiProvider)
        .getAuthApi()
        .authControllerVerifyOtp(
          verifyOtpDto: VerifyOtpDto(phone: phone, code: code),
        );
    final auth = res.data!;
    await ref
        .read(tokenStorageProvider)
        .save(access: auth.accessToken, refresh: auth.refreshToken);
    state = AsyncData(auth.user);
  }

  /// First-login name.
  Future<void> saveProfile({required String name, String? email}) async {
    final tokens = ref.read(tokenStorageProvider);
    final res = await ref
        .read(apiProvider)
        .dio
        .patch<Map<String, dynamic>>(
          '/api/v1/auth/me',
          data: {
            'name': name,
            if (email != null && email.isNotEmpty) 'email': email,
            'refreshToken': await tokens.refreshToken,
          },
        );
    final body = res.data!;
    await tokens.save(
      access: body['accessToken'] as String,
      refresh: body['refreshToken'] as String?,
    );
    state = AsyncData(MeDto.fromJson(body['user'] as Map<String, dynamic>));
  }

  Future<void> logout() async {
    final tokens = ref.read(tokenStorageProvider);
    final refresh = await tokens.refreshToken;
    if (ref.read(pushAvailableProvider)) {
      await unregisterPush(ref.read(apiProvider));
    }
    try {
      await ref
          .read(apiProvider)
          .getAuthApi()
          .authControllerLogout(refreshDto: RefreshDto(refreshToken: refresh));
    } catch (_) {
      // Log out locally even if the server can't be reached.
    }
    await tokens.clear();
    state = const AsyncData(null);
  }

  /// Called by the interceptor when the refresh token is rejected.
  void expire() => state = const AsyncData(null);
}

/// A number's first login creates the account without a name; ask for it once.
bool needsProfile(MeDto me) => me.name.trim().isEmpty;

final sessionControllerProvider =
    AsyncNotifierProvider<SessionController, MeDto?>(SessionController.new);
