// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'available_vehicle_dto.dart';

// **************************************************************************
// CopyWithGenerator
// **************************************************************************

abstract class _$AvailableVehicleDtoCWProxy {
  AvailableVehicleDto id(String id);

  AvailableVehicleDto regNo(String regNo);

  AvailableVehicleDto type(String type);

  AvailableVehicleDto seats(num seats);

  AvailableVehicleDto available(bool available);

  AvailableVehicleDto fits(bool fits);

  AvailableVehicleDto conflict(ConflictDto? conflict);

  /// This function **does support** nullification of nullable fields. All `null` values passed to `non-nullable` fields will be ignored. You can also use `AvailableVehicleDto(...).copyWith.fieldName(...)` to override fields one at a time with nullification support.
  ///
  /// Usage
  /// ```dart
  /// AvailableVehicleDto(...).copyWith(id: 12, name: "My name")
  /// ````
  AvailableVehicleDto call({
    String id,
    String regNo,
    String type,
    num seats,
    bool available,
    bool fits,
    ConflictDto? conflict,
  });
}

/// Proxy class for `copyWith` functionality. This is a callable class and can be used as follows: `instanceOfAvailableVehicleDto.copyWith(...)`. Additionally contains functions for specific fields e.g. `instanceOfAvailableVehicleDto.copyWith.fieldName(...)`
class _$AvailableVehicleDtoCWProxyImpl implements _$AvailableVehicleDtoCWProxy {
  const _$AvailableVehicleDtoCWProxyImpl(this._value);

  final AvailableVehicleDto _value;

  @override
  AvailableVehicleDto id(String id) => this(id: id);

  @override
  AvailableVehicleDto regNo(String regNo) => this(regNo: regNo);

  @override
  AvailableVehicleDto type(String type) => this(type: type);

  @override
  AvailableVehicleDto seats(num seats) => this(seats: seats);

  @override
  AvailableVehicleDto available(bool available) => this(available: available);

  @override
  AvailableVehicleDto fits(bool fits) => this(fits: fits);

  @override
  AvailableVehicleDto conflict(ConflictDto? conflict) =>
      this(conflict: conflict);

  @override
  /// This function **does support** nullification of nullable fields. All `null` values passed to `non-nullable` fields will be ignored. You can also use `AvailableVehicleDto(...).copyWith.fieldName(...)` to override fields one at a time with nullification support.
  ///
  /// Usage
  /// ```dart
  /// AvailableVehicleDto(...).copyWith(id: 12, name: "My name")
  /// ````
  AvailableVehicleDto call({
    Object? id = const $CopyWithPlaceholder(),
    Object? regNo = const $CopyWithPlaceholder(),
    Object? type = const $CopyWithPlaceholder(),
    Object? seats = const $CopyWithPlaceholder(),
    Object? available = const $CopyWithPlaceholder(),
    Object? fits = const $CopyWithPlaceholder(),
    Object? conflict = const $CopyWithPlaceholder(),
  }) {
    return AvailableVehicleDto(
      id: id == const $CopyWithPlaceholder()
          ? _value.id
          // ignore: cast_nullable_to_non_nullable
          : id as String,
      regNo: regNo == const $CopyWithPlaceholder()
          ? _value.regNo
          // ignore: cast_nullable_to_non_nullable
          : regNo as String,
      type: type == const $CopyWithPlaceholder()
          ? _value.type
          // ignore: cast_nullable_to_non_nullable
          : type as String,
      seats: seats == const $CopyWithPlaceholder()
          ? _value.seats
          // ignore: cast_nullable_to_non_nullable
          : seats as num,
      available: available == const $CopyWithPlaceholder()
          ? _value.available
          // ignore: cast_nullable_to_non_nullable
          : available as bool,
      fits: fits == const $CopyWithPlaceholder()
          ? _value.fits
          // ignore: cast_nullable_to_non_nullable
          : fits as bool,
      conflict: conflict == const $CopyWithPlaceholder()
          ? _value.conflict
          // ignore: cast_nullable_to_non_nullable
          : conflict as ConflictDto?,
    );
  }
}

extension $AvailableVehicleDtoCopyWith on AvailableVehicleDto {
  /// Returns a callable class that can be used as follows: `instanceOfAvailableVehicleDto.copyWith(...)` or like so:`instanceOfAvailableVehicleDto.copyWith.fieldName(...)`.
  // ignore: library_private_types_in_public_api
  _$AvailableVehicleDtoCWProxy get copyWith =>
      _$AvailableVehicleDtoCWProxyImpl(this);
}

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

AvailableVehicleDto _$AvailableVehicleDtoFromJson(
  Map<String, dynamic> json,
) => $checkedCreate('AvailableVehicleDto', json, ($checkedConvert) {
  $checkKeys(
    json,
    requiredKeys: const ['id', 'regNo', 'type', 'seats', 'available', 'fits'],
  );
  final val = AvailableVehicleDto(
    id: $checkedConvert('id', (v) => v as String),
    regNo: $checkedConvert('regNo', (v) => v as String),
    type: $checkedConvert('type', (v) => v as String),
    seats: $checkedConvert('seats', (v) => v as num),
    available: $checkedConvert('available', (v) => v as bool),
    fits: $checkedConvert('fits', (v) => v as bool),
    conflict: $checkedConvert(
      'conflict',
      (v) => v == null ? null : ConflictDto.fromJson(v as Map<String, dynamic>),
    ),
  );
  return val;
});

Map<String, dynamic> _$AvailableVehicleDtoToJson(
  AvailableVehicleDto instance,
) => <String, dynamic>{
  'id': instance.id,
  'regNo': instance.regNo,
  'type': instance.type,
  'seats': instance.seats,
  'available': instance.available,
  'fits': instance.fits,
  'conflict': ?instance.conflict?.toJson(),
};
