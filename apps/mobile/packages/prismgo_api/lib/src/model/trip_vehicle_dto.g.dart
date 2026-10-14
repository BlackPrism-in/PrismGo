// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'trip_vehicle_dto.dart';

// **************************************************************************
// CopyWithGenerator
// **************************************************************************

abstract class _$TripVehicleDtoCWProxy {
  TripVehicleDto id(String id);

  TripVehicleDto regNo(String regNo);

  TripVehicleDto type(String type);

  TripVehicleDto seats(num seats);

  /// This function **does support** nullification of nullable fields. All `null` values passed to `non-nullable` fields will be ignored. You can also use `TripVehicleDto(...).copyWith.fieldName(...)` to override fields one at a time with nullification support.
  ///
  /// Usage
  /// ```dart
  /// TripVehicleDto(...).copyWith(id: 12, name: "My name")
  /// ````
  TripVehicleDto call({String id, String regNo, String type, num seats});
}

/// Proxy class for `copyWith` functionality. This is a callable class and can be used as follows: `instanceOfTripVehicleDto.copyWith(...)`. Additionally contains functions for specific fields e.g. `instanceOfTripVehicleDto.copyWith.fieldName(...)`
class _$TripVehicleDtoCWProxyImpl implements _$TripVehicleDtoCWProxy {
  const _$TripVehicleDtoCWProxyImpl(this._value);

  final TripVehicleDto _value;

  @override
  TripVehicleDto id(String id) => this(id: id);

  @override
  TripVehicleDto regNo(String regNo) => this(regNo: regNo);

  @override
  TripVehicleDto type(String type) => this(type: type);

  @override
  TripVehicleDto seats(num seats) => this(seats: seats);

  @override
  /// This function **does support** nullification of nullable fields. All `null` values passed to `non-nullable` fields will be ignored. You can also use `TripVehicleDto(...).copyWith.fieldName(...)` to override fields one at a time with nullification support.
  ///
  /// Usage
  /// ```dart
  /// TripVehicleDto(...).copyWith(id: 12, name: "My name")
  /// ````
  TripVehicleDto call({
    Object? id = const $CopyWithPlaceholder(),
    Object? regNo = const $CopyWithPlaceholder(),
    Object? type = const $CopyWithPlaceholder(),
    Object? seats = const $CopyWithPlaceholder(),
  }) {
    return TripVehicleDto(
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
    );
  }
}

extension $TripVehicleDtoCopyWith on TripVehicleDto {
  /// Returns a callable class that can be used as follows: `instanceOfTripVehicleDto.copyWith(...)` or like so:`instanceOfTripVehicleDto.copyWith.fieldName(...)`.
  // ignore: library_private_types_in_public_api
  _$TripVehicleDtoCWProxy get copyWith => _$TripVehicleDtoCWProxyImpl(this);
}

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

TripVehicleDto _$TripVehicleDtoFromJson(Map<String, dynamic> json) =>
    $checkedCreate('TripVehicleDto', json, ($checkedConvert) {
      $checkKeys(json, requiredKeys: const ['id', 'regNo', 'type', 'seats']);
      final val = TripVehicleDto(
        id: $checkedConvert('id', (v) => v as String),
        regNo: $checkedConvert('regNo', (v) => v as String),
        type: $checkedConvert('type', (v) => v as String),
        seats: $checkedConvert('seats', (v) => v as num),
      );
      return val;
    });

Map<String, dynamic> _$TripVehicleDtoToJson(TripVehicleDto instance) =>
    <String, dynamic>{
      'id': instance.id,
      'regNo': instance.regNo,
      'type': instance.type,
      'seats': instance.seats,
    };
