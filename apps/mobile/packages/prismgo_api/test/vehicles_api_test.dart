import 'package:test/test.dart';
import 'package:prismgo_api/prismgo_api.dart';


/// tests for VehiclesApi
void main() {
  final instance = PrismgoApi().getVehiclesApi();

  group(VehiclesApi, () {
    //Future<VehicleDto> vehiclesControllerCreate(CreateVehicleDto createVehicleDto) async
    test('test vehiclesControllerCreate', () async {
      // TODO
    });

    //Future<List<VehicleDto>> vehiclesControllerList() async
    test('test vehiclesControllerList', () async {
      // TODO
    });

    //Future<VehicleDto> vehiclesControllerUpdate(String id, UpdateVehicleDto updateVehicleDto) async
    test('test vehiclesControllerUpdate', () async {
      // TODO
    });

  });
}
