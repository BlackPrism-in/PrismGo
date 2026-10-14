//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:copy_with_extension/copy_with_extension.dart';
import 'package:json_annotation/json_annotation.dart';

part 'gps_point_dto.g.dart';

@CopyWith()
@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class GpsPointDto {
  /// Returns a new [GpsPointDto] instance.
  GpsPointDto({
    required this.deviceId,

    required this.recordedAt,

    required this.lat,

    required this.lng,

    this.speedKmh,

    this.heading,

    this.ignition,

    this.odometerKm,
  });

  /// Tracker id in the vendor's system
  @JsonKey(name: r'deviceId', required: true, includeIfNull: false)
  final String deviceId;

  @JsonKey(name: r'recordedAt', required: true, includeIfNull: false)
  final DateTime recordedAt;

  @JsonKey(name: r'lat', required: true, includeIfNull: false)
  final num lat;

  @JsonKey(name: r'lng', required: true, includeIfNull: false)
  final num lng;

  @JsonKey(name: r'speedKmh', required: false, includeIfNull: false)
  final num? speedKmh;

  @JsonKey(name: r'heading', required: false, includeIfNull: false)
  final num? heading;

  @JsonKey(name: r'ignition', required: false, includeIfNull: false)
  final bool? ignition;

  @JsonKey(name: r'odometerKm', required: false, includeIfNull: false)
  final num? odometerKm;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is GpsPointDto &&
          other.deviceId == deviceId &&
          other.recordedAt == recordedAt &&
          other.lat == lat &&
          other.lng == lng &&
          other.speedKmh == speedKmh &&
          other.heading == heading &&
          other.ignition == ignition &&
          other.odometerKm == odometerKm;

  @override
  int get hashCode =>
      deviceId.hashCode +
      recordedAt.hashCode +
      lat.hashCode +
      lng.hashCode +
      speedKmh.hashCode +
      heading.hashCode +
      ignition.hashCode +
      odometerKm.hashCode;

  factory GpsPointDto.fromJson(Map<String, dynamic> json) =>
      _$GpsPointDtoFromJson(json);

  Map<String, dynamic> toJson() => _$GpsPointDtoToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }
}
