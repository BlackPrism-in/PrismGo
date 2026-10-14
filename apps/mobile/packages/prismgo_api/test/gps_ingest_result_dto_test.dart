import 'package:test/test.dart';
import 'package:prismgo_api/prismgo_api.dart';

// tests for GpsIngestResultDto
void main() {
  final GpsIngestResultDto? instance = /* GpsIngestResultDto(...) */ null;
  // TODO add properties to the entity

  group(GpsIngestResultDto, () {
    // num accepted
    test('to test the property `accepted`', () async {
      // TODO
    });

    // Already stored (same vehicle and time)
    // num duplicates
    test('to test the property `duplicates`', () async {
      // TODO
    });

    // Too old, in the future, or for an unknown device
    // num rejected
    test('to test the property `rejected`', () async {
      // TODO
    });

    // Device ids not linked to any vehicle
    // List<String> unknownDevices
    test('to test the property `unknownDevices`', () async {
      // TODO
    });

  });
}
