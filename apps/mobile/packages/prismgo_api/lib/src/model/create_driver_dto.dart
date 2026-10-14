//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:copy_with_extension/copy_with_extension.dart';
import 'package:json_annotation/json_annotation.dart';

part 'create_driver_dto.g.dart';

@CopyWith()
@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class CreateDriverDto {
  /// Returns a new [CreateDriverDto] instance.
  CreateDriverDto({
    required this.name,

    required this.phone,

    required this.licenceNo,

    this.licenceExpiry,

    this.defaultVehicleId,
  });

  @JsonKey(name: r'name', required: true, includeIfNull: false)
  final String name;

  @JsonKey(name: r'phone', required: true, includeIfNull: false)
  final String phone;

  @JsonKey(name: r'licenceNo', required: true, includeIfNull: false)
  final String licenceNo;

  @JsonKey(name: r'licenceExpiry', required: false, includeIfNull: false)
  final DateTime? licenceExpiry;

  @JsonKey(name: r'defaultVehicleId', required: false, includeIfNull: false)
  final String? defaultVehicleId;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is CreateDriverDto &&
          other.name == name &&
          other.phone == phone &&
          other.licenceNo == licenceNo &&
          other.licenceExpiry == licenceExpiry &&
          other.defaultVehicleId == defaultVehicleId;

  @override
  int get hashCode =>
      name.hashCode +
      phone.hashCode +
      licenceNo.hashCode +
      (licenceExpiry == null ? 0 : licenceExpiry.hashCode) +
      (defaultVehicleId == null ? 0 : defaultVehicleId.hashCode);

  factory CreateDriverDto.fromJson(Map<String, dynamic> json) =>
      _$CreateDriverDtoFromJson(json);

  Map<String, dynamic> toJson() => _$CreateDriverDtoToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }
}
