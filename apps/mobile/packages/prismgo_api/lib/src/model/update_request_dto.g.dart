// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'update_request_dto.dart';

// **************************************************************************
// CopyWithGenerator
// **************************************************************************

abstract class _$UpdateRequestDtoCWProxy {
  UpdateRequestDto pickup(LocationDto? pickup);

  UpdateRequestDto drop(LocationDto? drop);

  UpdateRequestDto startAt(DateTime? startAt);

  UpdateRequestDto returnAt(DateTime? returnAt);

  UpdateRequestDto passengers(num? passengers);

  UpdateRequestDto purpose(String? purpose);

  UpdateRequestDto notes(String? notes);

  /// This function **does support** nullification of nullable fields. All `null` values passed to `non-nullable` fields will be ignored. You can also use `UpdateRequestDto(...).copyWith.fieldName(...)` to override fields one at a time with nullification support.
  ///
  /// Usage
  /// ```dart
  /// UpdateRequestDto(...).copyWith(id: 12, name: "My name")
  /// ````
  UpdateRequestDto call({
    LocationDto? pickup,
    LocationDto? drop,
    DateTime? startAt,
    DateTime? returnAt,
    num? passengers,
    String? purpose,
    String? notes,
  });
}

/// Proxy class for `copyWith` functionality. This is a callable class and can be used as follows: `instanceOfUpdateRequestDto.copyWith(...)`. Additionally contains functions for specific fields e.g. `instanceOfUpdateRequestDto.copyWith.fieldName(...)`
class _$UpdateRequestDtoCWProxyImpl implements _$UpdateRequestDtoCWProxy {
  const _$UpdateRequestDtoCWProxyImpl(this._value);

  final UpdateRequestDto _value;

  @override
  UpdateRequestDto pickup(LocationDto? pickup) => this(pickup: pickup);

  @override
  UpdateRequestDto drop(LocationDto? drop) => this(drop: drop);

  @override
  UpdateRequestDto startAt(DateTime? startAt) => this(startAt: startAt);

  @override
  UpdateRequestDto returnAt(DateTime? returnAt) => this(returnAt: returnAt);

  @override
  UpdateRequestDto passengers(num? passengers) => this(passengers: passengers);

  @override
  UpdateRequestDto purpose(String? purpose) => this(purpose: purpose);

  @override
  UpdateRequestDto notes(String? notes) => this(notes: notes);

  @override
  /// This function **does support** nullification of nullable fields. All `null` values passed to `non-nullable` fields will be ignored. You can also use `UpdateRequestDto(...).copyWith.fieldName(...)` to override fields one at a time with nullification support.
  ///
  /// Usage
  /// ```dart
  /// UpdateRequestDto(...).copyWith(id: 12, name: "My name")
  /// ````
  UpdateRequestDto call({
    Object? pickup = const $CopyWithPlaceholder(),
    Object? drop = const $CopyWithPlaceholder(),
    Object? startAt = const $CopyWithPlaceholder(),
    Object? returnAt = const $CopyWithPlaceholder(),
    Object? passengers = const $CopyWithPlaceholder(),
    Object? purpose = const $CopyWithPlaceholder(),
    Object? notes = const $CopyWithPlaceholder(),
  }) {
    return UpdateRequestDto(
      pickup: pickup == const $CopyWithPlaceholder()
          ? _value.pickup
          // ignore: cast_nullable_to_non_nullable
          : pickup as LocationDto?,
      drop: drop == const $CopyWithPlaceholder()
          ? _value.drop
          // ignore: cast_nullable_to_non_nullable
          : drop as LocationDto?,
      startAt: startAt == const $CopyWithPlaceholder()
          ? _value.startAt
          // ignore: cast_nullable_to_non_nullable
          : startAt as DateTime?,
      returnAt: returnAt == const $CopyWithPlaceholder()
          ? _value.returnAt
          // ignore: cast_nullable_to_non_nullable
          : returnAt as DateTime?,
      passengers: passengers == const $CopyWithPlaceholder()
          ? _value.passengers
          // ignore: cast_nullable_to_non_nullable
          : passengers as num?,
      purpose: purpose == const $CopyWithPlaceholder()
          ? _value.purpose
          // ignore: cast_nullable_to_non_nullable
          : purpose as String?,
      notes: notes == const $CopyWithPlaceholder()
          ? _value.notes
          // ignore: cast_nullable_to_non_nullable
          : notes as String?,
    );
  }
}

extension $UpdateRequestDtoCopyWith on UpdateRequestDto {
  /// Returns a callable class that can be used as follows: `instanceOfUpdateRequestDto.copyWith(...)` or like so:`instanceOfUpdateRequestDto.copyWith.fieldName(...)`.
  // ignore: library_private_types_in_public_api
  _$UpdateRequestDtoCWProxy get copyWith => _$UpdateRequestDtoCWProxyImpl(this);
}

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

UpdateRequestDto _$UpdateRequestDtoFromJson(
  Map<String, dynamic> json,
) => $checkedCreate('UpdateRequestDto', json, ($checkedConvert) {
  final val = UpdateRequestDto(
    pickup: $checkedConvert(
      'pickup',
      (v) => v == null ? null : LocationDto.fromJson(v as Map<String, dynamic>),
    ),
    drop: $checkedConvert(
      'drop',
      (v) => v == null ? null : LocationDto.fromJson(v as Map<String, dynamic>),
    ),
    startAt: $checkedConvert(
      'startAt',
      (v) => v == null ? null : DateTime.parse(v as String),
    ),
    returnAt: $checkedConvert(
      'returnAt',
      (v) => v == null ? null : DateTime.parse(v as String),
    ),
    passengers: $checkedConvert('passengers', (v) => v as num?),
    purpose: $checkedConvert('purpose', (v) => v as String?),
    notes: $checkedConvert('notes', (v) => v as String?),
  );
  return val;
});

Map<String, dynamic> _$UpdateRequestDtoToJson(UpdateRequestDto instance) =>
    <String, dynamic>{
      'pickup': ?instance.pickup?.toJson(),
      'drop': ?instance.drop?.toJson(),
      'startAt': ?instance.startAt?.toIso8601String(),
      'returnAt': ?instance.returnAt?.toIso8601String(),
      'passengers': ?instance.passengers,
      'purpose': ?instance.purpose,
      'notes': ?instance.notes,
    };
