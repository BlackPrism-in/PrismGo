import 'package:test/test.dart';
import 'package:prismgo_api/prismgo_api.dart';


/// tests for DriversApi
void main() {
  final instance = PrismgoApi().getDriversApi();

  group(DriversApi, () {
    //Future<DriverDto> driversControllerCreate(CreateDriverDto createDriverDto) async
    test('test driversControllerCreate', () async {
      // TODO
    });

    //Future<List<DriverDto>> driversControllerList() async
    test('test driversControllerList', () async {
      // TODO
    });

    //Future<DriverDto> driversControllerUpdate(String id, UpdateDriverDto updateDriverDto) async
    test('test driversControllerUpdate', () async {
      // TODO
    });

  });
}
