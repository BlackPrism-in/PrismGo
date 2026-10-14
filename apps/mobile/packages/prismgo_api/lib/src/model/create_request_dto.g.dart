// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'create_request_dto.dart';

// **************************************************************************
// CopyWithGenerator
// **************************************************************************

abstract class _$CreateRequestDtoCWProxy {
  CreateRequestDto pickup(LocationDto pickup);

  CreateRequestDto drop(LocationDto drop);

  CreateRequestDto startAt(DateTime startAt);

  CreateRequestDto returnAt(DateTime? returnAt);

  CreateRequestDto passengers(num passengers);

  CreateRequestDto purpose(String purpose);

  CreateRequestDto notes(String? notes);

  CreateRequestDto submit(bool? submit);

  /// This function **does support** nullification of nullable fields. All `null` values passed to `non-nullable` fields will be ignored. You can also use `CreateRequestDto(...).copyWith.fieldName(...)` to override fields one at a time with nullification support.
  ///
  /// Usage
  /// ```dart
  /// CreateRequestDto(...).copyWith(id: 12, name: "My name")
  /// ````
  CreateRequestDto call({
    LocationDto pickup,
    LocationDto drop,
    DateTime startAt,
    DateTime? returnAt,
    num passengers,
    String purpose,
    String? notes,
    bool? submit,
  });
}

/// Proxy class for `copyWith` functionality. This is a callable class and can be used as follows: `instanceOfCreateRequestDto.copyWith(...)`. Additionally contains functions for specific fields e.g. `instanceOfCreateRequestDto.copyWith.fieldName(...)`
class _$CreateRequestDtoCWProxyImpl implements _$CreateRequestDtoCWProxy {
  const _$CreateRequestDtoCWProxyImpl(this._value);

  final CreateRequestDto _value;

  @override
  CreateRequestDto pickup(LocationDto pickup) => this(pickup: pickup);

  @override
  CreateRequestDto drop(LocationDto drop) => this(drop: drop);

  @override
  CreateRequestDto startAt(DateTime startAt) => this(startAt: startAt);

  @override
  CreateRequestDto returnAt(DateTime? returnAt) => this(returnAt: returnAt);

  @override
  CreateRequestDto passengers(num passengers) => this(passengers: passengers);

  @override
  CreateRequestDto purpose(String purpose) => this(purpose: purpose);

  @override
  CreateRequestDto notes(String? notes) => this(notes: notes);

  @override
  CreateRequestDto submit(bool? submit) => this(submit: submit);

  @override
  /// This function **does support** nullification of nullable fields. All `null` values passed to `non-nullable` fields will be ignored. You can also use `CreateRequestDto(...).copyWith.fieldName(...)` to override fields one at a time with nullification support.
  ///
  /// Usage
  /// ```dart
  /// CreateRequestDto(...).copyWith(id: 12, name: "My name")
  /// ````
  CreateRequestDto call({
    Object? pickup = const $CopyWithPlaceholder(),
    Object? drop = const $CopyWithPlaceholder(),
    Object? startAt = const $CopyWithPlaceholder(),
    Object? returnAt = const $CopyWithPlaceholder(),
    Object? passengers = const $CopyWithPlaceholder(),
    Object? purpose = const $CopyWithPlaceholder(),
    Object? notes = const $CopyWithPlaceholder(),
    Object? submit = const $CopyWithPlaceholder(),
  }) {
    return CreateRequestDto(
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
      submit: submit == const $CopyWithPlaceholder()
          ? _value.submit
          // ignore: cast_nullable_to_non_nullable
          : submit as bool?,
    );
  }
}

extension $CreateRequestDtoCopyWith on CreateRequestDto {
  /// Returns a callable class that can be used as follows: `instanceOfCreateRequestDto.copyWith(...)` or like so:`instanceOfCreateRequestDto.copyWith.fieldName(...)`.
  // ignore: library_private_types_in_public_api
  _$CreateRequestDtoCWProxy get copyWith => _$CreateRequestDtoCWProxyImpl(this);
}

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

CreateRequestDto _$CreateRequestDtoFromJson(Map<String, dynamic> json) =>
    $checkedCreate('CreateRequestDto', json, ($checkedConvert) {
      $checkKeys(
        json,
        requiredKeys: const [
          'pickup',
          'drop',
          'startAt',
          'passengers',
          'purpose',
        ],
      );
      final val = CreateRequestDto(
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
        submit: $checkedConvert('submit', (v) => v as bool?),
      );
      return val;
    });

Map<String, dynamic> _$CreateRequestDtoToJson(CreateRequestDto instance) =>
    <String, dynamic>{
      'pickup': instance.pickup.toJson(),
      'drop': instance.drop.toJson(),
      'startAt': instance.startAt.toIso8601String(),
      'returnAt': ?instance.returnAt?.toIso8601String(),
      'passengers': instance.passengers,
      'purpose': instance.purpose,
      'notes': ?instance.notes,
      'submit': ?instance.submit,
    };
