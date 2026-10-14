//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:prismgo_api/src/model/driver_status.dart';
import 'package:copy_with_extension/copy_with_extension.dart';
import 'package:json_annotation/json_annotation.dart';

part 'update_driver_dto.g.dart';

@CopyWith()
@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class UpdateDriverDto {
  /// Returns a new [UpdateDriverDto] instance.
  UpdateDriverDto({
    this.name,

    this.phone,

    this.licenceNo,

    this.licenceExpiry,

    this.defaultVehicleId,

    this.status,
  });

  @JsonKey(name: r'name', required: false, includeIfNull: false)
  final String? name;

  @JsonKey(name: r'phone', required: false, includeIfNull: false)
  final String? phone;

  @JsonKey(name: r'licenceNo', required: false, includeIfNull: false)
  final String? licenceNo;

  @JsonKey(name: r'licenceExpiry', required: false, includeIfNull: false)
  final DateTime? licenceExpiry;

  @JsonKey(name: r'defaultVehicleId', required: false, includeIfNull: false)
  final String? defaultVehicleId;

  @JsonKey(name: r'status', required: false, includeIfNull: false)
  final DriverStatus? status;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is UpdateDriverDto &&
          other.name == name &&
          other.phone == phone &&
          other.licenceNo == licenceNo &&
          other.licenceExpiry == licenceExpiry &&
          other.defaultVehicleId == defaultVehicleId &&
          other.status == status;

  @override
  int get hashCode =>
      name.hashCode +
      phone.hashCode +
      licenceNo.hashCode +
      (licenceExpiry == null ? 0 : licenceExpiry.hashCode) +
      (defaultVehicleId == null ? 0 : defaultVehicleId.hashCode) +
      status.hashCode;

  factory UpdateDriverDto.fromJson(Map<String, dynamic> json) =>
      _$UpdateDriverDtoFromJson(json);

  Map<String, dynamic> toJson() => _$UpdateDriverDtoToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }
}
