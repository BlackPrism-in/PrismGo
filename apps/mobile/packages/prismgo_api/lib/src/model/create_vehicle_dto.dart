//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:copy_with_extension/copy_with_extension.dart';
import 'package:json_annotation/json_annotation.dart';

part 'create_vehicle_dto.g.dart';

@CopyWith()
@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class CreateVehicleDto {
  /// Returns a new [CreateVehicleDto] instance.
  CreateVehicleDto({
    required this.regNo,

    required this.type,

    this.make,

    this.model,

    required this.seats,

    this.gpsDeviceId,
  });

  /// Stored uppercase without spaces
  @JsonKey(name: r'regNo', required: true, includeIfNull: false)
  final String regNo;

  @JsonKey(name: r'type', required: true, includeIfNull: false)
  final String type;

  @JsonKey(name: r'make', required: false, includeIfNull: false)
  final String? make;

  @JsonKey(name: r'model', required: false, includeIfNull: false)
  final String? model;

  @JsonKey(name: r'seats', required: true, includeIfNull: false)
  final num seats;

  /// The tracker's device id in the GPS vendor system
  @JsonKey(name: r'gpsDeviceId', required: false, includeIfNull: false)
  final String? gpsDeviceId;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is CreateVehicleDto &&
          other.regNo == regNo &&
          other.type == type &&
          other.make == make &&
          other.model == model &&
          other.seats == seats &&
          other.gpsDeviceId == gpsDeviceId;

  @override
  int get hashCode =>
      regNo.hashCode +
      type.hashCode +
      (make == null ? 0 : make.hashCode) +
      (model == null ? 0 : model.hashCode) +
      seats.hashCode +
      (gpsDeviceId == null ? 0 : gpsDeviceId.hashCode);

  factory CreateVehicleDto.fromJson(Map<String, dynamic> json) =>
      _$CreateVehicleDtoFromJson(json);

  Map<String, dynamic> toJson() => _$CreateVehicleDtoToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }
}
