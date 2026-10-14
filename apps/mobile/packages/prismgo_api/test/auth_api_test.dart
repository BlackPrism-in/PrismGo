import 'package:test/test.dart';
import 'package:prismgo_api/prismgo_api.dart';


/// tests for AuthApi
void main() {
  final instance = PrismgoApi().getAuthApi();

  group(AuthApi, () {
    //Future authControllerLogout(RefreshDto refreshDto, { String xClient }) async
    test('test authControllerLogout', () async {
      // TODO
    });

    //Future<MeDto> authControllerMe({ String xClient }) async
    test('test authControllerMe', () async {
      // TODO
    });

    //Future<AuthResponseDto> authControllerRefresh(RefreshDto refreshDto, { String xClient }) async
    test('test authControllerRefresh', () async {
      // TODO
    });

    //Future<RequestOtpResponseDto> authControllerRequestOtp(RequestOtpDto requestOtpDto, { String xClient }) async
    test('test authControllerRequestOtp', () async {
      // TODO
    });

    //Future<AuthResponseDto> authControllerVerifyOtp(VerifyOtpDto verifyOtpDto, { String xClient }) async
    test('test authControllerVerifyOtp', () async {
      // TODO
    });

  });
}
