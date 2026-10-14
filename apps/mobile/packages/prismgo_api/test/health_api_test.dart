import 'package:test/test.dart';
import 'package:prismgo_api/prismgo_api.dart';


/// tests for HealthApi
void main() {
  final instance = PrismgoApi().getHealthApi();

  group(HealthApi, () {
    //Future<Object> healthControllerCheck() async
    test('test healthControllerCheck', () async {
      // TODO
    });

  });
}
