//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:prismgo_api/src/model/vehicle_status.dart';
import 'package:copy_with_extension/copy_with_extension.dart';
import 'package:json_annotation/json_annotation.dart';

part 'vehicle_dto.g.dart';

@CopyWith()
@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class VehicleDto {
  /// Returns a new [VehicleDto] instance.
  VehicleDto({
    required this.id,

    required this.regNo,

    required this.type,

    this.make,

    this.model,

    required this.seats,

    required this.status,

    this.gpsDeviceId,
  });

  @JsonKey(name: r'id', required: true, includeIfNull: false)
  final String id;

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

  @JsonKey(name: r'status', required: true, includeIfNull: false)
  final VehicleStatus status;

  @JsonKey(name: r'gpsDeviceId', required: false, includeIfNull: false)
  final String? gpsDeviceId;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is VehicleDto &&
          other.id == id &&
          other.regNo == regNo &&
          other.type == type &&
          other.make == make &&
          other.model == model &&
          other.seats == seats &&
          other.status == status &&
          other.gpsDeviceId == gpsDeviceId;

  @override
  int get hashCode =>
      id.hashCode +
      regNo.hashCode +
      type.hashCode +
      (make == null ? 0 : make.hashCode) +
      (model == null ? 0 : model.hashCode) +
      seats.hashCode +
      status.hashCode +
      (gpsDeviceId == null ? 0 : gpsDeviceId.hashCode);

  factory VehicleDto.fromJson(Map<String, dynamic> json) =>
      _$VehicleDtoFromJson(json);

  Map<String, dynamic> toJson() => _$VehicleDtoToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }
}
