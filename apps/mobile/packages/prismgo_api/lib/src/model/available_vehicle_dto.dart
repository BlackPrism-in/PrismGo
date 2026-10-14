//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:prismgo_api/src/model/conflict_dto.dart';
import 'package:copy_with_extension/copy_with_extension.dart';
import 'package:json_annotation/json_annotation.dart';

part 'available_vehicle_dto.g.dart';

@CopyWith()
@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class AvailableVehicleDto {
  /// Returns a new [AvailableVehicleDto] instance.
  AvailableVehicleDto({
    required this.id,

    required this.regNo,

    required this.type,

    required this.seats,

    required this.available,

    required this.fits,

    this.conflict,
  });

  @JsonKey(name: r'id', required: true, includeIfNull: false)
  final String id;

  @JsonKey(name: r'regNo', required: true, includeIfNull: false)
  final String regNo;

  @JsonKey(name: r'type', required: true, includeIfNull: false)
  final String type;

  @JsonKey(name: r'seats', required: true, includeIfNull: false)
  final num seats;

  @JsonKey(name: r'available', required: true, includeIfNull: false)
  final bool available;

  /// Seats >= passengers
  @JsonKey(name: r'fits', required: true, includeIfNull: false)
  final bool fits;

  @JsonKey(name: r'conflict', required: false, includeIfNull: false)
  final ConflictDto? conflict;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is AvailableVehicleDto &&
          other.id == id &&
          other.regNo == regNo &&
          other.type == type &&
          other.seats == seats &&
          other.available == available &&
          other.fits == fits &&
          other.conflict == conflict;

  @override
  int get hashCode =>
      id.hashCode +
      regNo.hashCode +
      type.hashCode +
      seats.hashCode +
      available.hashCode +
      fits.hashCode +
      (conflict == null ? 0 : conflict.hashCode);

  factory AvailableVehicleDto.fromJson(Map<String, dynamic> json) =>
      _$AvailableVehicleDtoFromJson(json);

  Map<String, dynamic> toJson() => _$AvailableVehicleDtoToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }
}
