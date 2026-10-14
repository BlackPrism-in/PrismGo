// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'create_vehicle_dto.dart';

// **************************************************************************
// CopyWithGenerator
// **************************************************************************

abstract class _$CreateVehicleDtoCWProxy {
  CreateVehicleDto regNo(String regNo);

  CreateVehicleDto type(String type);

  CreateVehicleDto make(String? make);

  CreateVehicleDto model(String? model);

  CreateVehicleDto seats(num seats);

  CreateVehicleDto gpsDeviceId(String? gpsDeviceId);

  /// This function **does support** nullification of nullable fields. All `null` values passed to `non-nullable` fields will be ignored. You can also use `CreateVehicleDto(...).copyWith.fieldName(...)` to override fields one at a time with nullification support.
  ///
  /// Usage
  /// ```dart
  /// CreateVehicleDto(...).copyWith(id: 12, name: "My name")
  /// ````
  CreateVehicleDto call({
    String regNo,
    String type,
    String? make,
    String? model,
    num seats,
    String? gpsDeviceId,
  });
}

/// Proxy class for `copyWith` functionality. This is a callable class and can be used as follows: `instanceOfCreateVehicleDto.copyWith(...)`. Additionally contains functions for specific fields e.g. `instanceOfCreateVehicleDto.copyWith.fieldName(...)`
class _$CreateVehicleDtoCWProxyImpl implements _$CreateVehicleDtoCWProxy {
  const _$CreateVehicleDtoCWProxyImpl(this._value);

  final CreateVehicleDto _value;

  @override
  CreateVehicleDto regNo(String regNo) => this(regNo: regNo);

  @override
  CreateVehicleDto type(String type) => this(type: type);

  @override
  CreateVehicleDto make(String? make) => this(make: make);

  @override
  CreateVehicleDto model(String? model) => this(model: model);

  @override
  CreateVehicleDto seats(num seats) => this(seats: seats);

  @override
  CreateVehicleDto gpsDeviceId(String? gpsDeviceId) =>
      this(gpsDeviceId: gpsDeviceId);

  @override
  /// This function **does support** nullification of nullable fields. All `null` values passed to `non-nullable` fields will be ignored. You can also use `CreateVehicleDto(...).copyWith.fieldName(...)` to override fields one at a time with nullification support.
  ///
  /// Usage
  /// ```dart
  /// CreateVehicleDto(...).copyWith(id: 12, name: "My name")
  /// ````
  CreateVehicleDto call({
    Object? regNo = const $CopyWithPlaceholder(),
    Object? type = const $CopyWithPlaceholder(),
    Object? make = const $CopyWithPlaceholder(),
    Object? model = const $CopyWithPlaceholder(),
    Object? seats = const $CopyWithPlaceholder(),
    Object? gpsDeviceId = const $CopyWithPlaceholder(),
  }) {
    return CreateVehicleDto(
      regNo: regNo == const $CopyWithPlaceholder()
          ? _value.regNo
          // ignore: cast_nullable_to_non_nullable
          : regNo as String,
      type: type == const $CopyWithPlaceholder()
          ? _value.type
          // ignore: cast_nullable_to_non_nullable
          : type as String,
      make: make == const $CopyWithPlaceholder()
          ? _value.make
          // ignore: cast_nullable_to_non_nullable
          : make as String?,
      model: model == const $CopyWithPlaceholder()
          ? _value.model
          // ignore: cast_nullable_to_non_nullable
          : model as String?,
      seats: seats == const $CopyWithPlaceholder()
          ? _value.seats
          // ignore: cast_nullable_to_non_nullable
          : seats as num,
      gpsDeviceId: gpsDeviceId == const $CopyWithPlaceholder()
          ? _value.gpsDeviceId
          // ignore: cast_nullable_to_non_nullable
          : gpsDeviceId as String?,
    );
  }
}

extension $CreateVehicleDtoCopyWith on CreateVehicleDto {
  /// Returns a callable class that can be used as follows: `instanceOfCreateVehicleDto.copyWith(...)` or like so:`instanceOfCreateVehicleDto.copyWith.fieldName(...)`.
  // ignore: library_private_types_in_public_api
  _$CreateVehicleDtoCWProxy get copyWith => _$CreateVehicleDtoCWProxyImpl(this);
}

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

CreateVehicleDto _$CreateVehicleDtoFromJson(Map<String, dynamic> json) =>
    $checkedCreate('CreateVehicleDto', json, ($checkedConvert) {
      $checkKeys(json, requiredKeys: const ['regNo', 'type', 'seats']);
      final val = CreateVehicleDto(
        regNo: $checkedConvert('regNo', (v) => v as String),
        type: $checkedConvert('type', (v) => v as String),
        make: $checkedConvert('make', (v) => v as String?),
        model: $checkedConvert('model', (v) => v as String?),
        seats: $checkedConvert('seats', (v) => v as num),
        gpsDeviceId: $checkedConvert('gpsDeviceId', (v) => v as String?),
      );
      return val;
    });

Map<String, dynamic> _$CreateVehicleDtoToJson(CreateVehicleDto instance) =>
    <String, dynamic>{
      'regNo': instance.regNo,
      'type': instance.type,
      'make': ?instance.make,
      'model': ?instance.model,
      'seats': instance.seats,
      'gpsDeviceId': ?instance.gpsDeviceId,
    };
