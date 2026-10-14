//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:copy_with_extension/copy_with_extension.dart';
import 'package:json_annotation/json_annotation.dart';

part 'position_dto.g.dart';

@CopyWith()
@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class PositionDto {
  /// Returns a new [PositionDto] instance.
  PositionDto({
    required this.lat,

    required this.lng,

    this.speedKmh,

    this.heading,

    required this.recordedAt,
  });

  @JsonKey(name: r'lat', required: true, includeIfNull: false)
  final num lat;

  @JsonKey(name: r'lng', required: true, includeIfNull: false)
  final num lng;

  @JsonKey(name: r'speedKmh', required: false, includeIfNull: false)
  final num? speedKmh;

  @JsonKey(name: r'heading', required: false, includeIfNull: false)
  final num? heading;

  @JsonKey(name: r'recordedAt', required: true, includeIfNull: false)
  final DateTime recordedAt;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is PositionDto &&
          other.lat == lat &&
          other.lng == lng &&
          other.speedKmh == speedKmh &&
          other.heading == heading &&
          other.recordedAt == recordedAt;

  @override
  int get hashCode =>
      lat.hashCode +
      lng.hashCode +
      (speedKmh == null ? 0 : speedKmh.hashCode) +
      (heading == null ? 0 : heading.hashCode) +
      recordedAt.hashCode;

  factory PositionDto.fromJson(Map<String, dynamic> json) =>
      _$PositionDtoFromJson(json);

  Map<String, dynamic> toJson() => _$PositionDtoToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }
}
