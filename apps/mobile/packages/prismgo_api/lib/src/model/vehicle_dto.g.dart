// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'vehicle_dto.dart';

// **************************************************************************
// CopyWithGenerator
// **************************************************************************

abstract class _$VehicleDtoCWProxy {
  VehicleDto id(String id);

  VehicleDto regNo(String regNo);

  VehicleDto type(String type);

  VehicleDto make(String? make);

  VehicleDto model(String? model);

  VehicleDto seats(num seats);

  VehicleDto status(VehicleStatus status);

  VehicleDto gpsDeviceId(String? gpsDeviceId);

  /// This function **does support** nullification of nullable fields. All `null` values passed to `non-nullable` fields will be ignored. You can also use `VehicleDto(...).copyWith.fieldName(...)` to override fields one at a time with nullification support.
  ///
  /// Usage
  /// ```dart
  /// VehicleDto(...).copyWith(id: 12, name: "My name")
  /// ````
  VehicleDto call({
    String id,
    String regNo,
    String type,
    String? make,
    String? model,
    num seats,
    VehicleStatus status,
    String? gpsDeviceId,
  });
}

/// Proxy class for `copyWith` functionality. This is a callable class and can be used as follows: `instanceOfVehicleDto.copyWith(...)`. Additionally contains functions for specific fields e.g. `instanceOfVehicleDto.copyWith.fieldName(...)`
class _$VehicleDtoCWProxyImpl implements _$VehicleDtoCWProxy {
  const _$VehicleDtoCWProxyImpl(this._value);

  final VehicleDto _value;

  @override
  VehicleDto id(String id) => this(id: id);

  @override
  VehicleDto regNo(String regNo) => this(regNo: regNo);

  @override
  VehicleDto type(String type) => this(type: type);

  @override
  VehicleDto make(String? make) => this(make: make);

  @override
  VehicleDto model(String? model) => this(model: model);

  @override
  VehicleDto seats(num seats) => this(seats: seats);

  @override
  VehicleDto status(VehicleStatus status) => this(status: status);

  @override
  VehicleDto gpsDeviceId(String? gpsDeviceId) => this(gpsDeviceId: gpsDeviceId);

  @override
  /// This function **does support** nullification of nullable fields. All `null` values passed to `non-nullable` fields will be ignored. You can also use `VehicleDto(...).copyWith.fieldName(...)` to override fields one at a time with nullification support.
  ///
  /// Usage
  /// ```dart
  /// VehicleDto(...).copyWith(id: 12, name: "My name")
  /// ````
  VehicleDto call({
    Object? id = const $CopyWithPlaceholder(),
    Object? regNo = const $CopyWithPlaceholder(),
    Object? type = const $CopyWithPlaceholder(),
    Object? make = const $CopyWithPlaceholder(),
    Object? model = const $CopyWithPlaceholder(),
    Object? seats = const $CopyWithPlaceholder(),
    Object? status = const $CopyWithPlaceholder(),
    Object? gpsDeviceId = const $CopyWithPlaceholder(),
  }) {
    return VehicleDto(
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
      status: status == const $CopyWithPlaceholder()
          ? _value.status
          // ignore: cast_nullable_to_non_nullable
          : status as VehicleStatus,
      gpsDeviceId: gpsDeviceId == const $CopyWithPlaceholder()
          ? _value.gpsDeviceId
          // ignore: cast_nullable_to_non_nullable
          : gpsDeviceId as String?,
    );
  }
}

extension $VehicleDtoCopyWith on VehicleDto {
  /// Returns a callable class that can be used as follows: `instanceOfVehicleDto.copyWith(...)` or like so:`instanceOfVehicleDto.copyWith.fieldName(...)`.
  // ignore: library_private_types_in_public_api
  _$VehicleDtoCWProxy get copyWith => _$VehicleDtoCWProxyImpl(this);
}

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

VehicleDto _$VehicleDtoFromJson(Map<String, dynamic> json) =>
    $checkedCreate('VehicleDto', json, ($checkedConvert) {
      $checkKeys(
        json,
        requiredKeys: const ['id', 'regNo', 'type', 'seats', 'status'],
      );
      final val = VehicleDto(
        id: $checkedConvert('id', (v) => v as String),
        regNo: $checkedConvert('regNo', (v) => v as String),
        type: $checkedConvert('type', (v) => v as String),
        make: $checkedConvert('make', (v) => v as String?),
        model: $checkedConvert('model', (v) => v as String?),
        seats: $checkedConvert('seats', (v) => v as num),
        status: $checkedConvert(
          'status',
          (v) => $enumDecode(_$VehicleStatusEnumMap, v),
        ),
        gpsDeviceId: $checkedConvert('gpsDeviceId', (v) => v as String?),
      );
      return val;
    });

Map<String, dynamic> _$VehicleDtoToJson(VehicleDto instance) =>
    <String, dynamic>{
      'id': instance.id,
      'regNo': instance.regNo,
      'type': instance.type,
      'make': ?instance.make,
      'model': ?instance.model,
      'seats': instance.seats,
      'status': _$VehicleStatusEnumMap[instance.status]!,
      'gpsDeviceId': ?instance.gpsDeviceId,
    };

const _$VehicleStatusEnumMap = {
  VehicleStatus.available: 'available',
  VehicleStatus.onTrip: 'on_trip',
  VehicleStatus.maintenance: 'maintenance',
  VehicleStatus.inactive: 'inactive',
};
