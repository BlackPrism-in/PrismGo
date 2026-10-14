// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'driver_vehicle_dto.dart';

// **************************************************************************
// CopyWithGenerator
// **************************************************************************

abstract class _$DriverVehicleDtoCWProxy {
  DriverVehicleDto id(String id);

  DriverVehicleDto regNo(String regNo);

  /// This function **does support** nullification of nullable fields. All `null` values passed to `non-nullable` fields will be ignored. You can also use `DriverVehicleDto(...).copyWith.fieldName(...)` to override fields one at a time with nullification support.
  ///
  /// Usage
  /// ```dart
  /// DriverVehicleDto(...).copyWith(id: 12, name: "My name")
  /// ````
  DriverVehicleDto call({String id, String regNo});
}

/// Proxy class for `copyWith` functionality. This is a callable class and can be used as follows: `instanceOfDriverVehicleDto.copyWith(...)`. Additionally contains functions for specific fields e.g. `instanceOfDriverVehicleDto.copyWith.fieldName(...)`
class _$DriverVehicleDtoCWProxyImpl implements _$DriverVehicleDtoCWProxy {
  const _$DriverVehicleDtoCWProxyImpl(this._value);

  final DriverVehicleDto _value;

  @override
  DriverVehicleDto id(String id) => this(id: id);

  @override
  DriverVehicleDto regNo(String regNo) => this(regNo: regNo);

  @override
  /// This function **does support** nullification of nullable fields. All `null` values passed to `non-nullable` fields will be ignored. You can also use `DriverVehicleDto(...).copyWith.fieldName(...)` to override fields one at a time with nullification support.
  ///
  /// Usage
  /// ```dart
  /// DriverVehicleDto(...).copyWith(id: 12, name: "My name")
  /// ````
  DriverVehicleDto call({
    Object? id = const $CopyWithPlaceholder(),
    Object? regNo = const $CopyWithPlaceholder(),
  }) {
    return DriverVehicleDto(
      id: id == const $CopyWithPlaceholder()
          ? _value.id
          // ignore: cast_nullable_to_non_nullable
          : id as String,
      regNo: regNo == const $CopyWithPlaceholder()
          ? _value.regNo
          // ignore: cast_nullable_to_non_nullable
          : regNo as String,
    );
  }
}

extension $DriverVehicleDtoCopyWith on DriverVehicleDto {
  /// Returns a callable class that can be used as follows: `instanceOfDriverVehicleDto.copyWith(...)` or like so:`instanceOfDriverVehicleDto.copyWith.fieldName(...)`.
  // ignore: library_private_types_in_public_api
  _$DriverVehicleDtoCWProxy get copyWith => _$DriverVehicleDtoCWProxyImpl(this);
}

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

DriverVehicleDto _$DriverVehicleDtoFromJson(Map<String, dynamic> json) =>
    $checkedCreate('DriverVehicleDto', json, ($checkedConvert) {
      $checkKeys(json, requiredKeys: const ['id', 'regNo']);
      final val = DriverVehicleDto(
        id: $checkedConvert('id', (v) => v as String),
        regNo: $checkedConvert('regNo', (v) => v as String),
      );
      return val;
    });

Map<String, dynamic> _$DriverVehicleDtoToJson(DriverVehicleDto instance) =>
    <String, dynamic>{'id': instance.id, 'regNo': instance.regNo};
