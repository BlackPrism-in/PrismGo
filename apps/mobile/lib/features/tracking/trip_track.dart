import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:latlong2/latlong.dart';
import 'package:prismgo_api/prismgo_api.dart';

import '../../core/api.dart';

final tripTrackProvider = FutureProvider.autoDispose
    .family<TripTrackDto, String>((ref, tripId) async {
      final res = await ref
          .watch(apiProvider)
          .getLiveApi()
          .liveControllerTrack(id: tripId);
      return res.data!;
    });

/// Latest live fix for a trip from the socket, plus points driven since the
/// track was loaded. Lets the map move without refetching the whole track.
class LiveFix {
  const LiveFix({
    required this.position,
    required this.heading,
    required this.recordedAt,
    required this.etaMinutes,
    required this.etaTo,
    required this.extraPath,
  });

  final LatLng position;
  final double? heading;
  final DateTime recordedAt;
  final int? etaMinutes;
  final String etaTo;
  final List<LatLng> extraPath;

  /// Applies a `vehicle.position` socket payload.
  LiveFix next(Map<String, dynamic> p, {required bool driving}) {
    final point = LatLng(
      (p['lat'] as num).toDouble(),
      (p['lng'] as num).toDouble(),
    );
    return LiveFix(
      position: point,
      heading: (p['heading'] as num?)?.toDouble(),
      recordedAt: DateTime.parse(p['recordedAt'] as String),
      etaMinutes: (p['etaMinutes'] as num?)?.toInt(),
      etaTo: p['etaTo'] as String? ?? etaTo,
      extraPath: driving ? [...extraPath, point] : extraPath,
    );
  }

  static LiveFix fromPayload(Map<String, dynamic> p) => LiveFix(
    position: const LatLng(0, 0),
    heading: null,
    recordedAt: DateTime.fromMillisecondsSinceEpoch(0),
    etaMinutes: null,
    etaTo: 'pickup',
    extraPath: const [],
  ).next(p, driving: p['etaTo'] == 'drop');
}

final liveFixProvider = StateProvider.family<LiveFix?, String>(
  (ref, tripId) => null,
);

/// Called by the realtime connection for each `vehicle.position` event.
void applyVehiclePosition(Ref ref, Map<String, dynamic> payload) {
  final tripId = payload['tripId'] as String?;
  if (tripId == null) return;
  final notifier = ref.read(liveFixProvider(tripId).notifier);
  final current = notifier.state;
  notifier.state = current == null
      ? LiveFix.fromPayload(payload)
      : current.next(payload, driving: payload['etaTo'] == 'drop');
}
