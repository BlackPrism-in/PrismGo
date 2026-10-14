//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:copy_with_extension/copy_with_extension.dart';
import 'package:json_annotation/json_annotation.dart';

part 'gps_ingest_result_dto.g.dart';

@CopyWith()
@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class GpsIngestResultDto {
  /// Returns a new [GpsIngestResultDto] instance.
  GpsIngestResultDto({
    required this.accepted,

    required this.duplicates,

    required this.rejected,

    required this.unknownDevices,
  });

  @JsonKey(name: r'accepted', required: true, includeIfNull: false)
  final num accepted;

  /// Already stored (same vehicle and time)
  @JsonKey(name: r'duplicates', required: true, includeIfNull: false)
  final num duplicates;

  /// Too old, in the future, or for an unknown device
  @JsonKey(name: r'rejected', required: true, includeIfNull: false)
  final num rejected;

  /// Device ids not linked to any vehicle
  @JsonKey(name: r'unknownDevices', required: true, includeIfNull: false)
  final List<String> unknownDevices;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is GpsIngestResultDto &&
          other.accepted == accepted &&
          other.duplicates == duplicates &&
          other.rejected == rejected &&
          other.unknownDevices == unknownDevices;

  @override
  int get hashCode =>
      accepted.hashCode +
      duplicates.hashCode +
      rejected.hashCode +
      unknownDevices.hashCode;

  factory GpsIngestResultDto.fromJson(Map<String, dynamic> json) =>
      _$GpsIngestResultDtoFromJson(json);

  Map<String, dynamic> toJson() => _$GpsIngestResultDtoToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }
}
