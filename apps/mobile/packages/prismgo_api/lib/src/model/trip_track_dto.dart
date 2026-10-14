//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:prismgo_api/src/model/trip_status.dart';
import 'package:prismgo_api/src/model/position_dto.dart';
import 'package:prismgo_api/src/model/track_point_dto.dart';
import 'package:prismgo_api/src/model/eta_target.dart';
import 'package:copy_with_extension/copy_with_extension.dart';
import 'package:json_annotation/json_annotation.dart';

part 'trip_track_dto.g.dart';

@CopyWith()
@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class TripTrackDto {
  /// Returns a new [TripTrackDto] instance.
  TripTrackDto({
    required this.tripId,

    required this.requestId,

    required this.status,

    required this.vehicleRegNo,

    required this.pickup,

    required this.drop,

    required this.points,

    this.position,

    this.etaMinutes,

    required this.etaTo,
  });

  @JsonKey(name: r'tripId', required: true, includeIfNull: false)
  final String tripId;

  @JsonKey(name: r'requestId', required: true, includeIfNull: false)
  final String requestId;

  @JsonKey(name: r'status', required: true, includeIfNull: false)
  final TripStatus status;

  @JsonKey(name: r'vehicleRegNo', required: true, includeIfNull: false)
  final String vehicleRegNo;

  @JsonKey(name: r'pickup', required: true, includeIfNull: false)
  final TrackPointDto pickup;

  @JsonKey(name: r'drop', required: true, includeIfNull: false)
  final TrackPointDto drop;

  /// Driven path (at most 2000 points)
  @JsonKey(name: r'points', required: true, includeIfNull: false)
  final List<TrackPointDto> points;

  @JsonKey(name: r'position', required: false, includeIfNull: false)
  final PositionDto? position;

  @JsonKey(name: r'etaMinutes', required: false, includeIfNull: false)
  final num? etaMinutes;

  @JsonKey(name: r'etaTo', required: true, includeIfNull: false)
  final EtaTarget etaTo;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is TripTrackDto &&
          other.tripId == tripId &&
          other.requestId == requestId &&
          other.status == status &&
          other.vehicleRegNo == vehicleRegNo &&
          other.pickup == pickup &&
          other.drop == drop &&
          other.points == points &&
          other.position == position &&
          other.etaMinutes == etaMinutes &&
          other.etaTo == etaTo;

  @override
  int get hashCode =>
      tripId.hashCode +
      requestId.hashCode +
      status.hashCode +
      vehicleRegNo.hashCode +
      pickup.hashCode +
      drop.hashCode +
      points.hashCode +
      (position == null ? 0 : position.hashCode) +
      (etaMinutes == null ? 0 : etaMinutes.hashCode) +
      etaTo.hashCode;

  factory TripTrackDto.fromJson(Map<String, dynamic> json) =>
      _$TripTrackDtoFromJson(json);

  Map<String, dynamic> toJson() => _$TripTrackDtoToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }
}
