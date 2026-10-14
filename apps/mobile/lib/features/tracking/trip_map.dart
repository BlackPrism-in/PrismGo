import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:latlong2/latlong.dart';
import 'package:prismgo_api/prismgo_api.dart';

import '../../app/theme.dart';
import '../../core/api.dart';
import '../../shared/format.dart';
import 'trip_track.dart';

/// Pickup, drop, driven path and the live vehicle for one trip.
/// OpenStreetMap tiles until the Google Maps key is configured.
class TripMapCard extends ConsumerWidget {
  const TripMapCard({super.key, required this.tripId});

  final String tripId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final track = ref.watch(tripTrackProvider(tripId));
    final fix = ref.watch(liveFixProvider(tripId));

    return Card(
      clipBehavior: Clip.antiAlias,
      child: track.when(
        loading: () => const SizedBox(
          height: 260,
          child: Center(child: CircularProgressIndicator()),
        ),
        error: (e, _) => Padding(
          padding: const EdgeInsets.all(16),
          child: Text('Map unavailable: ${errorMessage(e)}'),
        ),
        data: (t) => _MapBody(track: t, fix: fix),
      ),
    );
  }
}

class _MapBody extends StatelessWidget {
  const _MapBody({required this.track, required this.fix});

  final TripTrackDto track;
  final LiveFix? fix;

  @override
  Widget build(BuildContext context) {
    LatLng ll(num lat, num lng) => LatLng(lat.toDouble(), lng.toDouble());
    final pickup = ll(track.pickup.lat, track.pickup.lng);
    final drop = ll(track.drop.lat, track.drop.lng);
    final live =
        track.status == TripStatus.scheduled ||
        track.status == TripStatus.inProgress;
    final path = [
      for (final p in track.points) ll(p.lat, p.lng),
      ...?fix?.extraPath,
    ];
    final vehicle =
        fix?.position ??
        (track.position == null
            ? null
            : ll(track.position!.lat, track.position!.lng));
    final heading = fix?.heading ?? track.position?.heading?.toDouble();
    final eta = fix?.etaMinutes ?? track.etaMinutes?.toInt();
    final etaTo = fix?.etaTo ?? track.etaTo.value;
    final updated = fix?.recordedAt ?? track.position?.recordedAt;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (live)
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 14, 16, 10),
            child: Text.rich(
              TextSpan(
                children: [
                  TextSpan(
                    text: vehicle == null
                        ? "Waiting for the vehicle's GPS…"
                        : eta != null
                        ? 'About $eta min to $etaTo'
                        : 'Live',
                    style: const TextStyle(fontWeight: FontWeight.w600),
                  ),
                  if (updated != null)
                    TextSpan(
                      text: ' · updated ${timeAgo(updated)}',
                      style: const TextStyle(color: Brand.sand500),
                    ),
                ],
              ),
            ),
          ),
        SizedBox(
          height: 260,
          child: FlutterMap(
            options: MapOptions(
              initialCameraFit: CameraFit.coordinates(
                coordinates: [pickup, drop, ?vehicle],
                padding: const EdgeInsets.all(40),
                maxZoom: 15,
              ),
            ),
            children: [
              TileLayer(
                urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                userAgentPackageName: 'in.blackprism.prismgo',
              ),
              PolylineLayer(
                polylines: [
                  Polyline(
                    points: [pickup, drop],
                    color: Brand.sand500,
                    strokeWidth: 2,
                    pattern: StrokePattern.dashed(segments: const [8, 8]),
                  ),
                  if (path.length > 1)
                    Polyline(points: path, color: Brand.coral, strokeWidth: 4),
                ],
              ),
              MarkerLayer(
                markers: [
                  _stop(pickup, 'P', Brand.ink, Brand.cream),
                  _stop(drop, 'D', Brand.coral, Brand.ink),
                  if (vehicle != null && live)
                    Marker(
                      point: vehicle,
                      width: 34,
                      height: 34,
                      child: _VehicleDot(
                        onTrip: track.status == TripStatus.inProgress,
                        heading: heading,
                      ),
                    ),
                ],
              ),
              const SimpleAttributionWidget(
                source: Text('OpenStreetMap contributors'),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Marker _stop(LatLng at, String label, Color bg, Color fg) => Marker(
    point: at,
    width: 28,
    height: 28,
    child: Container(
      decoration: BoxDecoration(
        color: bg,
        shape: BoxShape.circle,
        border: Border.all(color: Brand.ink, width: 1.5),
      ),
      alignment: Alignment.center,
      child: Text(
        label,
        style: TextStyle(color: fg, fontWeight: FontWeight.w700, fontSize: 12),
      ),
    ),
  );
}

class _VehicleDot extends StatelessWidget {
  const _VehicleDot({required this.onTrip, required this.heading});

  final bool onTrip;
  final double? heading;

  @override
  Widget build(BuildContext context) {
    return Semantics(
      label: 'Vehicle',
      child: Container(
        decoration: BoxDecoration(
          color: onTrip ? Brand.coral : Brand.mint,
          shape: BoxShape.circle,
          border: Border.all(color: Brand.ink, width: 2),
          boxShadow: const [BoxShadow(blurRadius: 4, color: Colors.black26)],
        ),
        child: heading == null
            ? const Icon(Icons.directions_car, size: 18, color: Brand.ink)
            : Transform.rotate(
                angle: heading! * 3.1415926535 / 180,
                child: const Icon(Icons.navigation, size: 18, color: Brand.ink),
              ),
      ),
    );
  }
}
