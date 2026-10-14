import 'package:test/test.dart';
import 'package:prismgo_api/prismgo_api.dart';


/// tests for GpsApi
void main() {
  final instance = PrismgoApi().getGpsApi();

  group(GpsApi, () {
    //Future<GpsIngestResultDto> gpsWebhookControllerIngest(String xGPSSecret, GpsBatchDto gpsBatchDto) async
    test('test gpsWebhookControllerIngest', () async {
      // TODO
    });

  });
}
