//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:prismgo_api/src/model/vehicle_status.dart';
import 'package:copy_with_extension/copy_with_extension.dart';
import 'package:json_annotation/json_annotation.dart';

part 'update_vehicle_dto.g.dart';

@CopyWith()
@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class UpdateVehicleDto {
  /// Returns a new [UpdateVehicleDto] instance.
  UpdateVehicleDto({
    this.regNo,

    this.type,

    this.make,

    this.model,

    this.seats,

    this.gpsDeviceId,

    this.status,
  });

  /// Stored uppercase without spaces
  @JsonKey(name: r'regNo', required: false, includeIfNull: false)
  final String? regNo;

  @JsonKey(name: r'type', required: false, includeIfNull: false)
  final String? type;

  @JsonKey(name: r'make', required: false, includeIfNull: false)
  final String? make;

  @JsonKey(name: r'model', required: false, includeIfNull: false)
  final String? model;

  @JsonKey(name: r'seats', required: false, includeIfNull: false)
  final num? seats;

  /// The tracker's device id in the GPS vendor system
  @JsonKey(name: r'gpsDeviceId', required: false, includeIfNull: false)
  final String? gpsDeviceId;

  @JsonKey(name: r'status', required: false, includeIfNull: false)
  final VehicleStatus? status;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is UpdateVehicleDto &&
          other.regNo == regNo &&
          other.type == type &&
          other.make == make &&
          other.model == model &&
          other.seats == seats &&
          other.gpsDeviceId == gpsDeviceId &&
          other.status == status;

  @override
  int get hashCode =>
      regNo.hashCode +
      type.hashCode +
      (make == null ? 0 : make.hashCode) +
      (model == null ? 0 : model.hashCode) +
      seats.hashCode +
      (gpsDeviceId == null ? 0 : gpsDeviceId.hashCode) +
      status.hashCode;

  factory UpdateVehicleDto.fromJson(Map<String, dynamic> json) =>
      _$UpdateVehicleDtoFromJson(json);

  Map<String, dynamic> toJson() => _$UpdateVehicleDtoToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }
}
