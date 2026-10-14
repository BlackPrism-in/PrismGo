//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:prismgo_api/src/model/conflict_dto.dart';
import 'package:copy_with_extension/copy_with_extension.dart';
import 'package:json_annotation/json_annotation.dart';

part 'available_driver_dto.g.dart';

@CopyWith()
@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class AvailableDriverDto {
  /// Returns a new [AvailableDriverDto] instance.
  AvailableDriverDto({
    required this.id,

    required this.name,

    required this.phone,

    this.defaultVehicleId,

    required this.available,

    this.conflict,
  });

  @JsonKey(name: r'id', required: true, includeIfNull: false)
  final String id;

  @JsonKey(name: r'name', required: true, includeIfNull: false)
  final String name;

  @JsonKey(name: r'phone', required: true, includeIfNull: false)
  final String phone;

  @JsonKey(name: r'defaultVehicleId', required: false, includeIfNull: false)
  final String? defaultVehicleId;

  @JsonKey(name: r'available', required: true, includeIfNull: false)
  final bool available;

  @JsonKey(name: r'conflict', required: false, includeIfNull: false)
  final ConflictDto? conflict;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is AvailableDriverDto &&
          other.id == id &&
          other.name == name &&
          other.phone == phone &&
          other.defaultVehicleId == defaultVehicleId &&
          other.available == available &&
          other.conflict == conflict;

  @override
  int get hashCode =>
      id.hashCode +
      name.hashCode +
      phone.hashCode +
      (defaultVehicleId == null ? 0 : defaultVehicleId.hashCode) +
      available.hashCode +
      (conflict == null ? 0 : conflict.hashCode);

  factory AvailableDriverDto.fromJson(Map<String, dynamic> json) =>
      _$AvailableDriverDtoFromJson(json);

  Map<String, dynamic> toJson() => _$AvailableDriverDtoToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }
}
