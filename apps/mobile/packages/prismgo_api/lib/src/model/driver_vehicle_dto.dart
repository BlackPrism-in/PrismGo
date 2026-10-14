//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:copy_with_extension/copy_with_extension.dart';
import 'package:json_annotation/json_annotation.dart';

part 'driver_vehicle_dto.g.dart';

@CopyWith()
@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class DriverVehicleDto {
  /// Returns a new [DriverVehicleDto] instance.
  DriverVehicleDto({required this.id, required this.regNo});

  @JsonKey(name: r'id', required: true, includeIfNull: false)
  final String id;

  @JsonKey(name: r'regNo', required: true, includeIfNull: false)
  final String regNo;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is DriverVehicleDto && other.id == id && other.regNo == regNo;

  @override
  int get hashCode => id.hashCode + regNo.hashCode;

  factory DriverVehicleDto.fromJson(Map<String, dynamic> json) =>
      _$DriverVehicleDtoFromJson(json);

  Map<String, dynamic> toJson() => _$DriverVehicleDtoToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }
}
