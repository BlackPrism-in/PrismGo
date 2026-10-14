//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:prismgo_api/src/model/gps_point_dto.dart';
import 'package:copy_with_extension/copy_with_extension.dart';
import 'package:json_annotation/json_annotation.dart';

part 'gps_batch_dto.g.dart';

@CopyWith()
@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class GpsBatchDto {
  /// Returns a new [GpsBatchDto] instance.
  GpsBatchDto({required this.points});

  @JsonKey(name: r'points', required: true, includeIfNull: false)
  final List<GpsPointDto> points;

  @override
  bool operator ==(Object other) =>
      identical(this, other) || other is GpsBatchDto && other.points == points;

  @override
  int get hashCode => points.hashCode;

  factory GpsBatchDto.fromJson(Map<String, dynamic> json) =>
      _$GpsBatchDtoFromJson(json);

  Map<String, dynamic> toJson() => _$GpsBatchDtoToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }
}
