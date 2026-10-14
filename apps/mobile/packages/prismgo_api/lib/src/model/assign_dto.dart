//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:copy_with_extension/copy_with_extension.dart';
import 'package:json_annotation/json_annotation.dart';

part 'assign_dto.g.dart';

@CopyWith()
@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class AssignDto {
  /// Returns a new [AssignDto] instance.
  AssignDto({
    required this.vehicleId,

    required this.driverId,

    this.scheduledEnd,
  });

  @JsonKey(name: r'vehicleId', required: true, includeIfNull: false)
  final String vehicleId;

  @JsonKey(name: r'driverId', required: true, includeIfNull: false)
  final String driverId;

  /// When the vehicle is free again. Defaults to the return time, else pickup + 2 hours.
  @JsonKey(name: r'scheduledEnd', required: false, includeIfNull: false)
  final DateTime? scheduledEnd;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is AssignDto &&
          other.vehicleId == vehicleId &&
          other.driverId == driverId &&
          other.scheduledEnd == scheduledEnd;

  @override
  int get hashCode =>
      vehicleId.hashCode +
      driverId.hashCode +
      (scheduledEnd == null ? 0 : scheduledEnd.hashCode);

  factory AssignDto.fromJson(Map<String, dynamic> json) =>
      _$AssignDtoFromJson(json);

  Map<String, dynamic> toJson() => _$AssignDtoToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }
}
