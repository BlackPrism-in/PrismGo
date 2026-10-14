//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:prismgo_api/src/model/trip_summary_dto.dart';
import 'package:prismgo_api/src/model/request_status.dart';
import 'package:prismgo_api/src/model/location_dto.dart';
import 'package:prismgo_api/src/model/person_dto.dart';
import 'package:prismgo_api/src/model/timeline_entry_dto.dart';
import 'package:prismgo_api/src/model/named_dto.dart';
import 'package:copy_with_extension/copy_with_extension.dart';
import 'package:json_annotation/json_annotation.dart';

part 'request_dto.g.dart';

@CopyWith()
@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class RequestDto {
  /// Returns a new [RequestDto] instance.
  RequestDto({
    required this.id,

    required this.code,

    required this.status,

    required this.requester,

    required this.department,

    required this.pickup,

    required this.drop,

    required this.startAt,

    this.returnAt,

    required this.passengers,

    required this.purpose,

    this.notes,

    this.cancelReason,

    this.trip,

    required this.timeline,

    required this.actions,

    required this.createdAt,
  });

  @JsonKey(name: r'id', required: true, includeIfNull: false)
  final String id;

  @JsonKey(name: r'code', required: true, includeIfNull: false)
  final String code;

  @JsonKey(name: r'status', required: true, includeIfNull: false)
  final RequestStatus status;

  @JsonKey(name: r'requester', required: true, includeIfNull: false)
  final PersonDto requester;

  @JsonKey(name: r'department', required: true, includeIfNull: false)
  final NamedDto department;

  @JsonKey(name: r'pickup', required: true, includeIfNull: false)
  final LocationDto pickup;

  @JsonKey(name: r'drop', required: true, includeIfNull: false)
  final LocationDto drop;

  @JsonKey(name: r'startAt', required: true, includeIfNull: false)
  final DateTime startAt;

  @JsonKey(name: r'returnAt', required: false, includeIfNull: false)
  final DateTime? returnAt;

  @JsonKey(name: r'passengers', required: true, includeIfNull: false)
  final num passengers;

  @JsonKey(name: r'purpose', required: true, includeIfNull: false)
  final String purpose;

  @JsonKey(name: r'notes', required: false, includeIfNull: false)
  final String? notes;

  @JsonKey(name: r'cancelReason', required: false, includeIfNull: false)
  final String? cancelReason;

  /// Current (non-cancelled) trip
  @JsonKey(name: r'trip', required: false, includeIfNull: false)
  final TripSummaryDto? trip;

  @JsonKey(name: r'timeline', required: true, includeIfNull: false)
  final List<TimelineEntryDto> timeline;

  /// What the signed-in user may do now
  @JsonKey(name: r'actions', required: true, includeIfNull: false)
  final List<String> actions;

  @JsonKey(name: r'createdAt', required: true, includeIfNull: false)
  final DateTime createdAt;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is RequestDto &&
          other.id == id &&
          other.code == code &&
          other.status == status &&
          other.requester == requester &&
          other.department == department &&
          other.pickup == pickup &&
          other.drop == drop &&
          other.startAt == startAt &&
          other.returnAt == returnAt &&
          other.passengers == passengers &&
          other.purpose == purpose &&
          other.notes == notes &&
          other.cancelReason == cancelReason &&
          other.trip == trip &&
          other.timeline == timeline &&
          other.actions == actions &&
          other.createdAt == createdAt;

  @override
  int get hashCode =>
      id.hashCode +
      code.hashCode +
      status.hashCode +
      requester.hashCode +
      department.hashCode +
      pickup.hashCode +
      drop.hashCode +
      startAt.hashCode +
      (returnAt == null ? 0 : returnAt.hashCode) +
      passengers.hashCode +
      purpose.hashCode +
      (notes == null ? 0 : notes.hashCode) +
      (cancelReason == null ? 0 : cancelReason.hashCode) +
      (trip == null ? 0 : trip.hashCode) +
      timeline.hashCode +
      actions.hashCode +
      createdAt.hashCode;

  factory RequestDto.fromJson(Map<String, dynamic> json) =>
      _$RequestDtoFromJson(json);

  Map<String, dynamic> toJson() => _$RequestDtoToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }
}
