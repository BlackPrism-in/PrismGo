//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:copy_with_extension/copy_with_extension.dart';
import 'package:json_annotation/json_annotation.dart';

part 'track_point_dto.g.dart';

@CopyWith()
@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class TrackPointDto {
  /// Returns a new [TrackPointDto] instance.
  TrackPointDto({required this.lat, required this.lng, required this.at});

  @JsonKey(name: r'lat', required: true, includeIfNull: false)
  final num lat;

  @JsonKey(name: r'lng', required: true, includeIfNull: false)
  final num lng;

  @JsonKey(name: r'at', required: true, includeIfNull: false)
  final DateTime at;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is TrackPointDto &&
          other.lat == lat &&
          other.lng == lng &&
          other.at == at;

  @override
  int get hashCode => lat.hashCode + lng.hashCode + at.hashCode;

  factory TrackPointDto.fromJson(Map<String, dynamic> json) =>
      _$TrackPointDtoFromJson(json);

  Map<String, dynamic> toJson() => _$TrackPointDtoToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }
}
