//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:prismgo_api/src/model/available_vehicle_dto.dart';
import 'package:prismgo_api/src/model/available_driver_dto.dart';
import 'package:copy_with_extension/copy_with_extension.dart';
import 'package:json_annotation/json_annotation.dart';

part 'availability_dto.g.dart';

@CopyWith()
@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class AvailabilityDto {
  /// Returns a new [AvailabilityDto] instance.
  AvailabilityDto({required this.vehicles, required this.drivers});

  @JsonKey(name: r'vehicles', required: true, includeIfNull: false)
  final List<AvailableVehicleDto> vehicles;

  @JsonKey(name: r'drivers', required: true, includeIfNull: false)
  final List<AvailableDriverDto> drivers;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is AvailabilityDto &&
          other.vehicles == vehicles &&
          other.drivers == drivers;

  @override
  int get hashCode => vehicles.hashCode + drivers.hashCode;

  factory AvailabilityDto.fromJson(Map<String, dynamic> json) =>
      _$AvailabilityDtoFromJson(json);

  Map<String, dynamic> toJson() => _$AvailabilityDtoToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }
}
