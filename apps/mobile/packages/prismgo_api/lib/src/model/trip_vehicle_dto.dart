//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:copy_with_extension/copy_with_extension.dart';
import 'package:json_annotation/json_annotation.dart';

part 'trip_vehicle_dto.g.dart';

@CopyWith()
@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class TripVehicleDto {
  /// Returns a new [TripVehicleDto] instance.
  TripVehicleDto({
    required this.id,

    required this.regNo,

    required this.type,

    required this.seats,
  });

  @JsonKey(name: r'id', required: true, includeIfNull: false)
  final String id;

  @JsonKey(name: r'regNo', required: true, includeIfNull: false)
  final String regNo;

  @JsonKey(name: r'type', required: true, includeIfNull: false)
  final String type;

  @JsonKey(name: r'seats', required: true, includeIfNull: false)
  final num seats;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is TripVehicleDto &&
          other.id == id &&
          other.regNo == regNo &&
          other.type == type &&
          other.seats == seats;

  @override
  int get hashCode =>
      id.hashCode + regNo.hashCode + type.hashCode + seats.hashCode;

  factory TripVehicleDto.fromJson(Map<String, dynamic> json) =>
      _$TripVehicleDtoFromJson(json);

  Map<String, dynamic> toJson() => _$TripVehicleDtoToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }
}
