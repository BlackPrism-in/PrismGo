// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'driver_dto.dart';

// **************************************************************************
// CopyWithGenerator
// **************************************************************************

abstract class _$DriverDtoCWProxy {
  DriverDto id(String id);

  DriverDto name(String name);

  DriverDto phone(String phone);

  DriverDto licenceNo(String licenceNo);

  DriverDto licenceExpiry(DateTime? licenceExpiry);

  DriverDto status(DriverStatus status);

  DriverDto defaultVehicle(DriverVehicleDto? defaultVehicle);

  /// This function **does support** nullification of nullable fields. All `null` values passed to `non-nullable` fields will be ignored. You can also use `DriverDto(...).copyWith.fieldName(...)` to override fields one at a time with nullification support.
  ///
  /// Usage
  /// ```dart
  /// DriverDto(...).copyWith(id: 12, name: "My name")
  /// ````
  DriverDto call({
    String id,
    String name,
    String phone,
    String licenceNo,
    DateTime? licenceExpiry,
    DriverStatus status,
    DriverVehicleDto? defaultVehicle,
  });
}

/// Proxy class for `copyWith` functionality. This is a callable class and can be used as follows: `instanceOfDriverDto.copyWith(...)`. Additionally contains functions for specific fields e.g. `instanceOfDriverDto.copyWith.fieldName(...)`
class _$DriverDtoCWProxyImpl implements _$DriverDtoCWProxy {
  const _$DriverDtoCWProxyImpl(this._value);

  final DriverDto _value;

  @override
  DriverDto id(String id) => this(id: id);

  @override
  DriverDto name(String name) => this(name: name);

  @override
  DriverDto phone(String phone) => this(phone: phone);

  @override
  DriverDto licenceNo(String licenceNo) => this(licenceNo: licenceNo);

  @override
  DriverDto licenceExpiry(DateTime? licenceExpiry) =>
      this(licenceExpiry: licenceExpiry);

  @override
  DriverDto status(DriverStatus status) => this(status: status);

  @override
  DriverDto defaultVehicle(DriverVehicleDto? defaultVehicle) =>
      this(defaultVehicle: defaultVehicle);

  @override
  /// This function **does support** nullification of nullable fields. All `null` values passed to `non-nullable` fields will be ignored. You can also use `DriverDto(...).copyWith.fieldName(...)` to override fields one at a time with nullification support.
  ///
  /// Usage
  /// ```dart
  /// DriverDto(...).copyWith(id: 12, name: "My name")
  /// ````
  DriverDto call({
    Object? id = const $CopyWithPlaceholder(),
    Object? name = const $CopyWithPlaceholder(),
    Object? phone = const $CopyWithPlaceholder(),
    Object? licenceNo = const $CopyWithPlaceholder(),
    Object? licenceExpiry = const $CopyWithPlaceholder(),
    Object? status = const $CopyWithPlaceholder(),
    Object? defaultVehicle = const $CopyWithPlaceholder(),
  }) {
    return DriverDto(
      id: id == const $CopyWithPlaceholder()
          ? _value.id
          // ignore: cast_nullable_to_non_nullable
          : id as String,
      name: name == const $CopyWithPlaceholder()
          ? _value.name
          // ignore: cast_nullable_to_non_nullable
          : name as String,
      phone: phone == const $CopyWithPlaceholder()
          ? _value.phone
          // ignore: cast_nullable_to_non_nullable
          : phone as String,
      licenceNo: licenceNo == const $CopyWithPlaceholder()
          ? _value.licenceNo
          // ignore: cast_nullable_to_non_nullable
          : licenceNo as String,
      licenceExpiry: licenceExpiry == const $CopyWithPlaceholder()
          ? _value.licenceExpiry
          // ignore: cast_nullable_to_non_nullable
          : licenceExpiry as DateTime?,
      status: status == const $CopyWithPlaceholder()
          ? _value.status
          // ignore: cast_nullable_to_non_nullable
          : status as DriverStatus,
      defaultVehicle: defaultVehicle == const $CopyWithPlaceholder()
          ? _value.defaultVehicle
          // ignore: cast_nullable_to_non_nullable
          : defaultVehicle as DriverVehicleDto?,
    );
  }
}

extension $DriverDtoCopyWith on DriverDto {
  /// Returns a callable class that can be used as follows: `instanceOfDriverDto.copyWith(...)` or like so:`instanceOfDriverDto.copyWith.fieldName(...)`.
  // ignore: library_private_types_in_public_api
  _$DriverDtoCWProxy get copyWith => _$DriverDtoCWProxyImpl(this);
}

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

DriverDto _$DriverDtoFromJson(Map<String, dynamic> json) =>
    $checkedCreate('DriverDto', json, ($checkedConvert) {
      $checkKeys(
        json,
        requiredKeys: const ['id', 'name', 'phone', 'licenceNo', 'status'],
      );
      final val = DriverDto(
        id: $checkedConvert('id', (v) => v as String),
        name: $checkedConvert('name', (v) => v as String),
        phone: $checkedConvert('phone', (v) => v as String),
        licenceNo: $checkedConvert('licenceNo', (v) => v as String),
        licenceExpiry: $checkedConvert(
          'licenceExpiry',
          (v) => v == null ? null : DateTime.parse(v as String),
        ),
        status: $checkedConvert(
          'status',
          (v) => $enumDecode(_$DriverStatusEnumMap, v),
        ),
        defaultVehicle: $checkedConvert(
          'defaultVehicle',
          (v) => v == null
              ? null
              : DriverVehicleDto.fromJson(v as Map<String, dynamic>),
        ),
      );
      return val;
    });

Map<String, dynamic> _$DriverDtoToJson(DriverDto instance) => <String, dynamic>{
  'id': instance.id,
  'name': instance.name,
  'phone': instance.phone,
  'licenceNo': instance.licenceNo,
  'licenceExpiry': ?instance.licenceExpiry?.toIso8601String(),
  'status': _$DriverStatusEnumMap[instance.status]!,
  'defaultVehicle': ?instance.defaultVehicle?.toJson(),
};

const _$DriverStatusEnumMap = {
  DriverStatus.active: 'active',
  DriverStatus.onLeave: 'on_leave',
  DriverStatus.inactive: 'inactive',
};
