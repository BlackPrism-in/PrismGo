import 'package:test/test.dart';
import 'package:prismgo_api/prismgo_api.dart';


/// tests for LiveApi
void main() {
  final instance = PrismgoApi().getLiveApi();

  group(LiveApi, () {
    //Future<RequestDto> liveControllerEnd(String id) async
    test('test liveControllerEnd', () async {
      // TODO
    });

    //Future<RequestDto> liveControllerStart(String id) async
    test('test liveControllerStart', () async {
      // TODO
    });

    //Future<TripTrackDto> liveControllerTrack(String id) async
    test('test liveControllerTrack', () async {
      // TODO
    });

    //Future<List<LiveVehicleDto>> liveControllerVehicles() async
    test('test liveControllerVehicles', () async {
      // TODO
    });

  });
}
