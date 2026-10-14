//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:prismgo_api/src/model/trip_status.dart';
import 'package:prismgo_api/src/model/trip_vehicle_dto.dart';
import 'package:prismgo_api/src/model/person_dto.dart';
import 'package:copy_with_extension/copy_with_extension.dart';
import 'package:json_annotation/json_annotation.dart';

part 'trip_summary_dto.g.dart';

@CopyWith()
@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class TripSummaryDto {
  /// Returns a new [TripSummaryDto] instance.
  TripSummaryDto({
    required this.id,

    required this.status,

    required this.vehicle,

    required this.driver,

    required this.scheduledStart,

    required this.scheduledEnd,
  });

  @JsonKey(name: r'id', required: true, includeIfNull: false)
  final String id;

  @JsonKey(name: r'status', required: true, includeIfNull: false)
  final TripStatus status;

  @JsonKey(name: r'vehicle', required: true, includeIfNull: false)
  final TripVehicleDto vehicle;

  @JsonKey(name: r'driver', required: true, includeIfNull: false)
  final PersonDto driver;

  @JsonKey(name: r'scheduledStart', required: true, includeIfNull: false)
  final DateTime scheduledStart;

  @JsonKey(name: r'scheduledEnd', required: true, includeIfNull: false)
  final DateTime scheduledEnd;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is TripSummaryDto &&
          other.id == id &&
          other.status == status &&
          other.vehicle == vehicle &&
          other.driver == driver &&
          other.scheduledStart == scheduledStart &&
          other.scheduledEnd == scheduledEnd;

  @override
  int get hashCode =>
      id.hashCode +
      status.hashCode +
      vehicle.hashCode +
      driver.hashCode +
      scheduledStart.hashCode +
      scheduledEnd.hashCode;

  factory TripSummaryDto.fromJson(Map<String, dynamic> json) =>
      _$TripSummaryDtoFromJson(json);

  Map<String, dynamic> toJson() => _$TripSummaryDtoToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }
}
