// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'availability_dto.dart';

// **************************************************************************
// CopyWithGenerator
// **************************************************************************

abstract class _$AvailabilityDtoCWProxy {
  AvailabilityDto vehicles(List<AvailableVehicleDto> vehicles);

  AvailabilityDto drivers(List<AvailableDriverDto> drivers);

  /// This function **does support** nullification of nullable fields. All `null` values passed to `non-nullable` fields will be ignored. You can also use `AvailabilityDto(...).copyWith.fieldName(...)` to override fields one at a time with nullification support.
  ///
  /// Usage
  /// ```dart
  /// AvailabilityDto(...).copyWith(id: 12, name: "My name")
  /// ````
  AvailabilityDto call({
    List<AvailableVehicleDto> vehicles,
    List<AvailableDriverDto> drivers,
  });
}

/// Proxy class for `copyWith` functionality. This is a callable class and can be used as follows: `instanceOfAvailabilityDto.copyWith(...)`. Additionally contains functions for specific fields e.g. `instanceOfAvailabilityDto.copyWith.fieldName(...)`
class _$AvailabilityDtoCWProxyImpl implements _$AvailabilityDtoCWProxy {
  const _$AvailabilityDtoCWProxyImpl(this._value);

  final AvailabilityDto _value;

  @override
  AvailabilityDto vehicles(List<AvailableVehicleDto> vehicles) =>
      this(vehicles: vehicles);

  @override
  AvailabilityDto drivers(List<AvailableDriverDto> drivers) =>
      this(drivers: drivers);

  @override
  /// This function **does support** nullification of nullable fields. All `null` values passed to `non-nullable` fields will be ignored. You can also use `AvailabilityDto(...).copyWith.fieldName(...)` to override fields one at a time with nullification support.
  ///
  /// Usage
  /// ```dart
  /// AvailabilityDto(...).copyWith(id: 12, name: "My name")
  /// ````
  AvailabilityDto call({
    Object? vehicles = const $CopyWithPlaceholder(),
    Object? drivers = const $CopyWithPlaceholder(),
  }) {
    return AvailabilityDto(
      vehicles: vehicles == const $CopyWithPlaceholder()
          ? _value.vehicles
          // ignore: cast_nullable_to_non_nullable
          : vehicles as List<AvailableVehicleDto>,
      drivers: drivers == const $CopyWithPlaceholder()
          ? _value.drivers
          // ignore: cast_nullable_to_non_nullable
          : drivers as List<AvailableDriverDto>,
    );
  }
}

extension $AvailabilityDtoCopyWith on AvailabilityDto {
  /// Returns a callable class that can be used as follows: `instanceOfAvailabilityDto.copyWith(...)` or like so:`instanceOfAvailabilityDto.copyWith.fieldName(...)`.
  // ignore: library_private_types_in_public_api
  _$AvailabilityDtoCWProxy get copyWith => _$AvailabilityDtoCWProxyImpl(this);
}

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

AvailabilityDto _$AvailabilityDtoFromJson(
  Map<String, dynamic> json,
) => $checkedCreate('AvailabilityDto', json, ($checkedConvert) {
  $checkKeys(json, requiredKeys: const ['vehicles', 'drivers']);
  final val = AvailabilityDto(
    vehicles: $checkedConvert(
      'vehicles',
      (v) => (v as List<dynamic>)
          .map((e) => AvailableVehicleDto.fromJson(e as Map<String, dynamic>))
          .toList(),
    ),
    drivers: $checkedConvert(
      'drivers',
      (v) => (v as List<dynamic>)
          .map((e) => AvailableDriverDto.fromJson(e as Map<String, dynamic>))
          .toList(),
    ),
  );
  return val;
});

Map<String, dynamic> _$AvailabilityDtoToJson(AvailabilityDto instance) =>
    <String, dynamic>{
      'vehicles': instance.vehicles.map((e) => e.toJson()).toList(),
      'drivers': instance.drivers.map((e) => e.toJson()).toList(),
    };
