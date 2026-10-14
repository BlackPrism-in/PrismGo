// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'request_dto.dart';

// **************************************************************************
// CopyWithGenerator
// **************************************************************************

abstract class _$RequestDtoCWProxy {
  RequestDto id(String id);

  RequestDto code(String code);

  RequestDto status(RequestStatus status);

  RequestDto requester(PersonDto requester);

  RequestDto department(NamedDto department);

  RequestDto pickup(LocationDto pickup);

  RequestDto drop(LocationDto drop);

  RequestDto startAt(DateTime startAt);

  RequestDto returnAt(DateTime? returnAt);

  RequestDto passengers(num passengers);

  RequestDto purpose(String purpose);

  RequestDto notes(String? notes);

  RequestDto cancelReason(String? cancelReason);

  RequestDto trip(TripSummaryDto? trip);

  RequestDto timeline(List<TimelineEntryDto> timeline);

  RequestDto actions(List<String> actions);

  RequestDto createdAt(DateTime createdAt);

  /// This function **does support** nullification of nullable fields. All `null` values passed to `non-nullable` fields will be ignored. You can also use `RequestDto(...).copyWith.fieldName(...)` to override fields one at a time with nullification support.
  ///
  /// Usage
  /// ```dart
  /// RequestDto(...).copyWith(id: 12, name: "My name")
  /// ````
  RequestDto call({
    String id,
    String code,
    RequestStatus status,
    PersonDto requester,
    NamedDto department,
    LocationDto pickup,
    LocationDto drop,
    DateTime startAt,
    DateTime? returnAt,
    num passengers,
    String purpose,
    String? notes,
    String? cancelReason,
    TripSummaryDto? trip,
    List<TimelineEntryDto> timeline,
    List<String> actions,
    DateTime createdAt,
  });
}

/// Proxy class for `copyWith` functionality. This is a callable class and can be used as follows: `instanceOfRequestDto.copyWith(...)`. Additionally contains functions for specific fields e.g. `instanceOfRequestDto.copyWith.fieldName(...)`
class _$RequestDtoCWProxyImpl implements _$RequestDtoCWProxy {
  const _$RequestDtoCWProxyImpl(this._value);

  final RequestDto _value;

  @override
  RequestDto id(String id) => this(id: id);

  @override
  RequestDto code(String code) => this(code: code);

  @override
  RequestDto status(RequestStatus status) => this(status: status);

  @override
  RequestDto requester(PersonDto requester) => this(requester: requester);

  @override
  RequestDto department(NamedDto department) => this(department: department);

  @override
  RequestDto pickup(LocationDto pickup) => this(pickup: pickup);

  @override
  RequestDto drop(LocationDto drop) => this(drop: drop);

  @override
  RequestDto startAt(DateTime startAt) => this(startAt: startAt);

  @override
  RequestDto returnAt(DateTime? returnAt) => this(returnAt: returnAt);

  @override
  RequestDto passengers(num passengers) => this(passengers: passengers);

  @override
  RequestDto purpose(String purpose) => this(purpose: purpose);

  @override
  RequestDto notes(String? notes) => this(notes: notes);

  @override
  RequestDto cancelReason(String? cancelReason) =>
      this(cancelReason: cancelReason);

  @override
  RequestDto trip(TripSummaryDto? trip) => this(trip: trip);

  @override
  RequestDto timeline(List<TimelineEntryDto> timeline) =>
      this(timeline: timeline);

  @override
  RequestDto actions(List<String> actions) => this(actions: actions);

  @override
  RequestDto createdAt(DateTime createdAt) => this(createdAt: createdAt);

  @override
  /// This function **does support** nullification of nullable fields. All `null` values passed to `non-nullable` fields will be ignored. You can also use `RequestDto(...).copyWith.fieldName(...)` to override fields one at a time with nullification support.
  ///
  /// Usage
  /// ```dart
  /// RequestDto(...).copyWith(id: 12, name: "My name")
  /// ````
  RequestDto call({
    Object? id = const $CopyWithPlaceholder(),
    Object? code = const $CopyWithPlaceholder(),
    Object? status = const $CopyWithPlaceholder(),
    Object? requester = const $CopyWithPlaceholder(),
    Object? department = const $CopyWithPlaceholder(),
    Object? pickup = const $CopyWithPlaceholder(),
    Object? drop = const $CopyWithPlaceholder(),
    Object? startAt = const $CopyWithPlaceholder(),
    Object? returnAt = const $CopyWithPlaceholder(),
    Object? passengers = const $CopyWithPlaceholder(),
    Object? purpose = const $CopyWithPlaceholder(),
    Object? notes = const $CopyWithPlaceholder(),
    Object? cancelReason = const $CopyWithPlaceholder(),
    Object? trip = const $CopyWithPlaceholder(),
    Object? timeline = const $CopyWithPlaceholder(),
    Object? actions = const $CopyWithPlaceholder(),
    Object? createdAt = const $CopyWithPlaceholder(),
  }) {
    return RequestDto(
      id: id == const $CopyWithPlaceholder()
          ? _value.id
          // ignore: cast_nullable_to_non_nullable
          : id as String,
      code: code == const $CopyWithPlaceholder()
          ? _value.code
          // ignore: cast_nullable_to_non_nullable
          : code as String,
      status: status == const $CopyWithPlaceholder()
          ? _value.status
          // ignore: cast_nullable_to_non_nullable
          : status as RequestStatus,
      requester: requester == const $CopyWithPlaceholder()
          ? _value.requester
          // ignore: cast_nullable_to_non_nullable
          : requester as PersonDto,
      department: department == const $CopyWithPlaceholder()
          ? _value.department
          // ignore: cast_nullable_to_non_nullable
          : department as NamedDto,
      pickup: pickup == const $CopyWithPlaceholder()
          ? _value.pickup
          // ignore: cast_nullable_to_non_nullable
          : pickup as LocationDto,
      drop: drop == const $CopyWithPlaceholder()
          ? _value.drop
          // ignore: cast_nullable_to_non_nullable
          : drop as LocationDto,
      startAt: startAt == const $CopyWithPlaceholder()
          ? _value.startAt
          // ignore: cast_nullable_to_non_nullable
          : startAt as DateTime,
      returnAt: returnAt == const $CopyWithPlaceholder()
          ? _value.returnAt
          // ignore: cast_nullable_to_non_nullable
          : returnAt as DateTime?,
      passengers: passengers == const $CopyWithPlaceholder()
          ? _value.passengers
          // ignore: cast_nullable_to_non_nullable
          : passengers as num,
      purpose: purpose == const $CopyWithPlaceholder()
          ? _value.purpose
          // ignore: cast_nullable_to_non_nullable
          : purpose as String,
      notes: notes == const $CopyWithPlaceholder()
          ? _value.notes
          // ignore: cast_nullable_to_non_nullable
          : notes as String?,
      cancelReason: cancelReason == const $CopyWithPlaceholder()
          ? _value.cancelReason
          // ignore: cast_nullable_to_non_nullable
          : cancelReason as String?,
      trip: trip == const $CopyWithPlaceholder()
          ? _value.trip
          // ignore: cast_nullable_to_non_nullable
          : trip as TripSummaryDto?,
      timeline: timeline == const $CopyWithPlaceholder()
          ? _value.timeline
          // ignore: cast_nullable_to_non_nullable
          : timeline as List<TimelineEntryDto>,
      actions: actions == const $CopyWithPlaceholder()
          ? _value.actions
          // ignore: cast_nullable_to_non_nullable
          : actions as List<String>,
      createdAt: createdAt == const $CopyWithPlaceholder()
          ? _value.createdAt
          // ignore: cast_nullable_to_non_nullable
          : createdAt as DateTime,
    );
  }
}

extension $RequestDtoCopyWith on RequestDto {
  /// Returns a callable class that can be used as follows: `instanceOfRequestDto.copyWith(...)` or like so:`instanceOfRequestDto.copyWith.fieldName(...)`.
  // ignore: library_private_types_in_public_api
  _$RequestDtoCWProxy get copyWith => _$RequestDtoCWProxyImpl(this);
}

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

RequestDto _$RequestDtoFromJson(
  Map<String, dynamic> json,
) => $checkedCreate('RequestDto', json, ($checkedConvert) {
  $checkKeys(
    json,
    requiredKeys: const [
      'id',
      'code',
      'status',
      'requester',
      'department',
      'pickup',
      'drop',
      'startAt',
      'passengers',
      'purpose',
      'timeline',
      'actions',
      'createdAt',
    ],
  );
  final val = RequestDto(
    id: $checkedConvert('id', (v) => v as String),
    code: $checkedConvert('code', (v) => v as String),
    status: $checkedConvert(
      'status',
      (v) => $enumDecode(_$RequestStatusEnumMap, v),
    ),
    requester: $checkedConvert(
      'requester',
      (v) => PersonDto.fromJson(v as Map<String, dynamic>),
    ),
    department: $checkedConvert(
      'department',
      (v) => NamedDto.fromJson(v as Map<String, dynamic>),
    ),
    pickup: $checkedConvert(
      'pickup',
      (v) => LocationDto.fromJson(v as Map<String, dynamic>),
    ),
    drop: $checkedConvert(
      'drop',
      (v) => LocationDto.fromJson(v as Map<String, dynamic>),
    ),
    startAt: $checkedConvert('startAt', (v) => DateTime.parse(v as String)),
    returnAt: $checkedConvert(
      'returnAt',
      (v) => v == null ? null : DateTime.parse(v as String),
    ),
    passengers: $checkedConvert('passengers', (v) => v as num),
    purpose: $checkedConvert('purpose', (v) => v as String),
    notes: $checkedConvert('notes', (v) => v as String?),
    cancelReason: $checkedConvert('cancelReason', (v) => v as String?),
    trip: $checkedConvert(
      'trip',
      (v) =>
          v == null ? null : TripSummaryDto.fromJson(v as Map<String, dynamic>),
    ),
    timeline: $checkedConvert(
      'timeline',
      (v) => (v as List<dynamic>)
          .map((e) => TimelineEntryDto.fromJson(e as Map<String, dynamic>))
          .toList(),
    ),
    actions: $checkedConvert(
      'actions',
      (v) => (v as List<dynamic>).map((e) => e as String).toList(),
    ),
    createdAt: $checkedConvert('createdAt', (v) => DateTime.parse(v as String)),
  );
  return val;
});

Map<String, dynamic> _$RequestDtoToJson(RequestDto instance) =>
    <String, dynamic>{
      'id': instance.id,
      'code': instance.code,
      'status': _$RequestStatusEnumMap[instance.status]!,
      'requester': instance.requester.toJson(),
      'department': instance.department.toJson(),
      'pickup': instance.pickup.toJson(),
      'drop': instance.drop.toJson(),
      'startAt': instance.startAt.toIso8601String(),
      'returnAt': ?instance.returnAt?.toIso8601String(),
      'passengers': instance.passengers,
      'purpose': instance.purpose,
      'notes': ?instance.notes,
      'cancelReason': ?instance.cancelReason,
      'trip': ?instance.trip?.toJson(),
      'timeline': instance.timeline.map((e) => e.toJson()).toList(),
      'actions': instance.actions,
      'createdAt': instance.createdAt.toIso8601String(),
    };

const _$RequestStatusEnumMap = {
  RequestStatus.draft: 'draft',
  RequestStatus.pendingApproval: 'pending_approval',
  RequestStatus.approved: 'approved',
  RequestStatus.rejected: 'rejected',
  RequestStatus.assigned: 'assigned',
  RequestStatus.inProgress: 'in_progress',
  RequestStatus.completed: 'completed',
  RequestStatus.cancelled: 'cancelled',
};
