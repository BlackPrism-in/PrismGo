// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'update_vehicle_dto.dart';

// **************************************************************************
// CopyWithGenerator
// **************************************************************************

abstract class _$UpdateVehicleDtoCWProxy {
  UpdateVehicleDto regNo(String? regNo);

  UpdateVehicleDto type(String? type);

  UpdateVehicleDto make(String? make);

  UpdateVehicleDto model(String? model);

  UpdateVehicleDto seats(num? seats);

  UpdateVehicleDto gpsDeviceId(String? gpsDeviceId);

  UpdateVehicleDto status(VehicleStatus? status);

  /// This function **does support** nullification of nullable fields. All `null` values passed to `non-nullable` fields will be ignored. You can also use `UpdateVehicleDto(...).copyWith.fieldName(...)` to override fields one at a time with nullification support.
  ///
  /// Usage
  /// ```dart
  /// UpdateVehicleDto(...).copyWith(id: 12, name: "My name")
  /// ````
  UpdateVehicleDto call({
    String? regNo,
    String? type,
    String? make,
    String? model,
    num? seats,
    String? gpsDeviceId,
    VehicleStatus? status,
  });
}

/// Proxy class for `copyWith` functionality. This is a callable class and can be used as follows: `instanceOfUpdateVehicleDto.copyWith(...)`. Additionally contains functions for specific fields e.g. `instanceOfUpdateVehicleDto.copyWith.fieldName(...)`
class _$UpdateVehicleDtoCWProxyImpl implements _$UpdateVehicleDtoCWProxy {
  const _$UpdateVehicleDtoCWProxyImpl(this._value);

  final UpdateVehicleDto _value;

  @override
  UpdateVehicleDto regNo(String? regNo) => this(regNo: regNo);

  @override
  UpdateVehicleDto type(String? type) => this(type: type);

  @override
  UpdateVehicleDto make(String? make) => this(make: make);

  @override
  UpdateVehicleDto model(String? model) => this(model: model);

  @override
  UpdateVehicleDto seats(num? seats) => this(seats: seats);

  @override
  UpdateVehicleDto gpsDeviceId(String? gpsDeviceId) =>
      this(gpsDeviceId: gpsDeviceId);

  @override
  UpdateVehicleDto status(VehicleStatus? status) => this(status: status);

  @override
  /// This function **does support** nullification of nullable fields. All `null` values passed to `non-nullable` fields will be ignored. You can also use `UpdateVehicleDto(...).copyWith.fieldName(...)` to override fields one at a time with nullification support.
  ///
  /// Usage
  /// ```dart
  /// UpdateVehicleDto(...).copyWith(id: 12, name: "My name")
  /// ````
  UpdateVehicleDto call({
    Object? regNo = const $CopyWithPlaceholder(),
    Object? type = const $CopyWithPlaceholder(),
    Object? make = const $CopyWithPlaceholder(),
    Object? model = const $CopyWithPlaceholder(),
    Object? seats = const $CopyWithPlaceholder(),
    Object? gpsDeviceId = const $CopyWithPlaceholder(),
    Object? status = const $CopyWithPlaceholder(),
  }) {
    return UpdateVehicleDto(
      regNo: regNo == const $CopyWithPlaceholder()
          ? _value.regNo
          // ignore: cast_nullable_to_non_nullable
          : regNo as String?,
      type: type == const $CopyWithPlaceholder()
          ? _value.type
          // ignore: cast_nullable_to_non_nullable
          : type as String?,
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
          : seats as num?,
      gpsDeviceId: gpsDeviceId == const $CopyWithPlaceholder()
          ? _value.gpsDeviceId
          // ignore: cast_nullable_to_non_nullable
          : gpsDeviceId as String?,
      status: status == const $CopyWithPlaceholder()
          ? _value.status
          // ignore: cast_nullable_to_non_nullable
          : status as VehicleStatus?,
    );
  }
}

extension $UpdateVehicleDtoCopyWith on UpdateVehicleDto {
  /// Returns a callable class that can be used as follows: `instanceOfUpdateVehicleDto.copyWith(...)` or like so:`instanceOfUpdateVehicleDto.copyWith.fieldName(...)`.
  // ignore: library_private_types_in_public_api
  _$UpdateVehicleDtoCWProxy get copyWith => _$UpdateVehicleDtoCWProxyImpl(this);
}

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

UpdateVehicleDto _$UpdateVehicleDtoFromJson(Map<String, dynamic> json) =>
    $checkedCreate('UpdateVehicleDto', json, ($checkedConvert) {
      final val = UpdateVehicleDto(
        regNo: $checkedConvert('regNo', (v) => v as String?),
        type: $checkedConvert('type', (v) => v as String?),
        make: $checkedConvert('make', (v) => v as String?),
        model: $checkedConvert('model', (v) => v as String?),
        seats: $checkedConvert('seats', (v) => v as num?),
        gpsDeviceId: $checkedConvert('gpsDeviceId', (v) => v as String?),
        status: $checkedConvert(
          'status',
          (v) => $enumDecodeNullable(_$VehicleStatusEnumMap, v),
        ),
      );
      return val;
    });

Map<String, dynamic> _$UpdateVehicleDtoToJson(UpdateVehicleDto instance) =>
    <String, dynamic>{
      'regNo': ?instance.regNo,
      'type': ?instance.type,
      'make': ?instance.make,
      'model': ?instance.model,
      'seats': ?instance.seats,
      'gpsDeviceId': ?instance.gpsDeviceId,
      'status': ?_$VehicleStatusEnumMap[instance.status],
    };

const _$VehicleStatusEnumMap = {
  VehicleStatus.available: 'available',
  VehicleStatus.onTrip: 'on_trip',
  VehicleStatus.maintenance: 'maintenance',
  VehicleStatus.inactive: 'inactive',
};
