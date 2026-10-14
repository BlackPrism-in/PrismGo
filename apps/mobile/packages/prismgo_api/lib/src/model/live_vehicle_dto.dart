//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:prismgo_api/src/model/position_dto.dart';
import 'package:prismgo_api/src/model/live_trip_dto.dart';
import 'package:prismgo_api/src/model/vehicle_status.dart';
import 'package:copy_with_extension/copy_with_extension.dart';
import 'package:json_annotation/json_annotation.dart';

part 'live_vehicle_dto.g.dart';

@CopyWith()
@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class LiveVehicleDto {
  /// Returns a new [LiveVehicleDto] instance.
  LiveVehicleDto({
    required this.id,

    required this.regNo,

    required this.type,

    required this.status,

    this.gpsDeviceId,

    this.position,

    required this.stale,

    this.trip,
  });

  @JsonKey(name: r'id', required: true, includeIfNull: false)
  final String id;

  @JsonKey(name: r'regNo', required: true, includeIfNull: false)
  final String regNo;

  @JsonKey(name: r'type', required: true, includeIfNull: false)
  final String type;

  @JsonKey(name: r'status', required: true, includeIfNull: false)
  final VehicleStatus status;

  @JsonKey(name: r'gpsDeviceId', required: false, includeIfNull: false)
  final String? gpsDeviceId;

  @JsonKey(name: r'position', required: false, includeIfNull: false)
  final PositionDto? position;

  /// No position in the last 5 minutes
  @JsonKey(name: r'stale', required: true, includeIfNull: false)
  final bool stale;

  /// In progress, or the next one within an hour
  @JsonKey(name: r'trip', required: false, includeIfNull: false)
  final LiveTripDto? trip;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is LiveVehicleDto &&
          other.id == id &&
          other.regNo == regNo &&
          other.type == type &&
          other.status == status &&
          other.gpsDeviceId == gpsDeviceId &&
          other.position == position &&
          other.stale == stale &&
          other.trip == trip;

  @override
  int get hashCode =>
      id.hashCode +
      regNo.hashCode +
      type.hashCode +
      status.hashCode +
      (gpsDeviceId == null ? 0 : gpsDeviceId.hashCode) +
      (position == null ? 0 : position.hashCode) +
      stale.hashCode +
      (trip == null ? 0 : trip.hashCode);

  factory LiveVehicleDto.fromJson(Map<String, dynamic> json) =>
      _$LiveVehicleDtoFromJson(json);

  Map<String, dynamic> toJson() => _$LiveVehicleDtoToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }
}
