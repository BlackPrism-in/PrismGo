//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:copy_with_extension/copy_with_extension.dart';
import 'package:json_annotation/json_annotation.dart';

part 'reassign_dto.g.dart';

@CopyWith()
@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class ReassignDto {
  /// Returns a new [ReassignDto] instance.
  ReassignDto({this.vehicleId, this.driverId});

  @JsonKey(name: r'vehicleId', required: false, includeIfNull: false)
  final String? vehicleId;

  @JsonKey(name: r'driverId', required: false, includeIfNull: false)
  final String? driverId;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is ReassignDto &&
          other.vehicleId == vehicleId &&
          other.driverId == driverId;

  @override
  int get hashCode => vehicleId.hashCode + driverId.hashCode;

  factory ReassignDto.fromJson(Map<String, dynamic> json) =>
      _$ReassignDtoFromJson(json);

  Map<String, dynamic> toJson() => _$ReassignDtoToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }
}
