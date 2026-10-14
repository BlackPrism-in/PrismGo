import 'package:flutter_test/flutter_test.dart';
import 'package:prismgo/features/tracking/trip_track.dart';

Map<String, dynamic> payload(double lat, String etaTo, {int eta = 10}) => {
  'tripId': 't1',
  'lat': lat,
  'lng': 77.6,
  'heading': 45,
  'recordedAt': '2026-10-16T05:00:00Z',
  'etaMinutes': eta,
  'etaTo': etaTo,
};

void main() {
  test(
    'moves the vehicle but only extends the path while driving to the drop',
    () {
      var fix = LiveFix.fromPayload(payload(12.90, 'pickup'));
      expect(fix.position.latitude, 12.90);
      expect(fix.extraPath, isEmpty);

      fix = fix.next(payload(12.95, 'drop', eta: 20), driving: true);
      fix = fix.next(payload(12.96, 'drop', eta: 18), driving: true);
      expect(fix.extraPath, hasLength(2));
      expect(fix.etaMinutes, 18);
      expect(fix.etaTo, 'drop');
      expect(fix.heading, 45);
    },
  );
}
