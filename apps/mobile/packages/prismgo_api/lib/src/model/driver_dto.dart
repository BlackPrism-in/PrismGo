//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:prismgo_api/src/model/driver_vehicle_dto.dart';
import 'package:prismgo_api/src/model/driver_status.dart';
import 'package:copy_with_extension/copy_with_extension.dart';
import 'package:json_annotation/json_annotation.dart';

part 'driver_dto.g.dart';

@CopyWith()
@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class DriverDto {
  /// Returns a new [DriverDto] instance.
  DriverDto({
    required this.id,

    required this.name,

    required this.phone,

    required this.licenceNo,

    this.licenceExpiry,

    required this.status,

    this.defaultVehicle,
  });

  @JsonKey(name: r'id', required: true, includeIfNull: false)
  final String id;

  @JsonKey(name: r'name', required: true, includeIfNull: false)
  final String name;

  @JsonKey(name: r'phone', required: true, includeIfNull: false)
  final String phone;

  @JsonKey(name: r'licenceNo', required: true, includeIfNull: false)
  final String licenceNo;

  @JsonKey(name: r'licenceExpiry', required: false, includeIfNull: false)
  final DateTime? licenceExpiry;

  @JsonKey(name: r'status', required: true, includeIfNull: false)
  final DriverStatus status;

  @JsonKey(name: r'defaultVehicle', required: false, includeIfNull: false)
  final DriverVehicleDto? defaultVehicle;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is DriverDto &&
          other.id == id &&
          other.name == name &&
          other.phone == phone &&
          other.licenceNo == licenceNo &&
          other.licenceExpiry == licenceExpiry &&
          other.status == status &&
          other.defaultVehicle == defaultVehicle;

  @override
  int get hashCode =>
      id.hashCode +
      name.hashCode +
      phone.hashCode +
      licenceNo.hashCode +
      (licenceExpiry == null ? 0 : licenceExpiry.hashCode) +
      status.hashCode +
      (defaultVehicle == null ? 0 : defaultVehicle.hashCode);

  factory DriverDto.fromJson(Map<String, dynamic> json) =>
      _$DriverDtoFromJson(json);

  Map<String, dynamic> toJson() => _$DriverDtoToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }
}
