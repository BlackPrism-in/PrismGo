// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'update_driver_dto.dart';

// **************************************************************************
// CopyWithGenerator
// **************************************************************************

abstract class _$UpdateDriverDtoCWProxy {
  UpdateDriverDto name(String? name);

  UpdateDriverDto phone(String? phone);

  UpdateDriverDto licenceNo(String? licenceNo);

  UpdateDriverDto licenceExpiry(DateTime? licenceExpiry);

  UpdateDriverDto defaultVehicleId(String? defaultVehicleId);

  UpdateDriverDto status(DriverStatus? status);

  /// This function **does support** nullification of nullable fields. All `null` values passed to `non-nullable` fields will be ignored. You can also use `UpdateDriverDto(...).copyWith.fieldName(...)` to override fields one at a time with nullification support.
  ///
  /// Usage
  /// ```dart
  /// UpdateDriverDto(...).copyWith(id: 12, name: "My name")
  /// ````
  UpdateDriverDto call({
    String? name,
    String? phone,
    String? licenceNo,
    DateTime? licenceExpiry,
    String? defaultVehicleId,
    DriverStatus? status,
  });
}

/// Proxy class for `copyWith` functionality. This is a callable class and can be used as follows: `instanceOfUpdateDriverDto.copyWith(...)`. Additionally contains functions for specific fields e.g. `instanceOfUpdateDriverDto.copyWith.fieldName(...)`
class _$UpdateDriverDtoCWProxyImpl implements _$UpdateDriverDtoCWProxy {
  const _$UpdateDriverDtoCWProxyImpl(this._value);

  final UpdateDriverDto _value;

  @override
  UpdateDriverDto name(String? name) => this(name: name);

  @override
  UpdateDriverDto phone(String? phone) => this(phone: phone);

  @override
  UpdateDriverDto licenceNo(String? licenceNo) => this(licenceNo: licenceNo);

  @override
  UpdateDriverDto licenceExpiry(DateTime? licenceExpiry) =>
      this(licenceExpiry: licenceExpiry);

  @override
  UpdateDriverDto defaultVehicleId(String? defaultVehicleId) =>
      this(defaultVehicleId: defaultVehicleId);

  @override
  UpdateDriverDto status(DriverStatus? status) => this(status: status);

  @override
  /// This function **does support** nullification of nullable fields. All `null` values passed to `non-nullable` fields will be ignored. You can also use `UpdateDriverDto(...).copyWith.fieldName(...)` to override fields one at a time with nullification support.
  ///
  /// Usage
  /// ```dart
  /// UpdateDriverDto(...).copyWith(id: 12, name: "My name")
  /// ````
  UpdateDriverDto call({
    Object? name = const $CopyWithPlaceholder(),
    Object? phone = const $CopyWithPlaceholder(),
    Object? licenceNo = const $CopyWithPlaceholder(),
    Object? licenceExpiry = const $CopyWithPlaceholder(),
    Object? defaultVehicleId = const $CopyWithPlaceholder(),
    Object? status = const $CopyWithPlaceholder(),
  }) {
    return UpdateDriverDto(
      name: name == const $CopyWithPlaceholder()
          ? _value.name
          // ignore: cast_nullable_to_non_nullable
          : name as String?,
      phone: phone == const $CopyWithPlaceholder()
          ? _value.phone
          // ignore: cast_nullable_to_non_nullable
          : phone as String?,
      licenceNo: licenceNo == const $CopyWithPlaceholder()
          ? _value.licenceNo
          // ignore: cast_nullable_to_non_nullable
          : licenceNo as String?,
      licenceExpiry: licenceExpiry == const $CopyWithPlaceholder()
          ? _value.licenceExpiry
          // ignore: cast_nullable_to_non_nullable
          : licenceExpiry as DateTime?,
      defaultVehicleId: defaultVehicleId == const $CopyWithPlaceholder()
          ? _value.defaultVehicleId
          // ignore: cast_nullable_to_non_nullable
          : defaultVehicleId as String?,
      status: status == const $CopyWithPlaceholder()
          ? _value.status
          // ignore: cast_nullable_to_non_nullable
          : status as DriverStatus?,
    );
  }
}

extension $UpdateDriverDtoCopyWith on UpdateDriverDto {
  /// Returns a callable class that can be used as follows: `instanceOfUpdateDriverDto.copyWith(...)` or like so:`instanceOfUpdateDriverDto.copyWith.fieldName(...)`.
  // ignore: library_private_types_in_public_api
  _$UpdateDriverDtoCWProxy get copyWith => _$UpdateDriverDtoCWProxyImpl(this);
}

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

UpdateDriverDto _$UpdateDriverDtoFromJson(Map<String, dynamic> json) =>
    $checkedCreate('UpdateDriverDto', json, ($checkedConvert) {
      final val = UpdateDriverDto(
        name: $checkedConvert('name', (v) => v as String?),
        phone: $checkedConvert('phone', (v) => v as String?),
        licenceNo: $checkedConvert('licenceNo', (v) => v as String?),
        licenceExpiry: $checkedConvert(
          'licenceExpiry',
          (v) => v == null ? null : DateTime.parse(v as String),
        ),
        defaultVehicleId: $checkedConvert(
          'defaultVehicleId',
          (v) => v as String?,
        ),
        status: $checkedConvert(
          'status',
          (v) => $enumDecodeNullable(_$DriverStatusEnumMap, v),
        ),
      );
      return val;
    });

Map<String, dynamic> _$UpdateDriverDtoToJson(UpdateDriverDto instance) =>
    <String, dynamic>{
      'name': ?instance.name,
      'phone': ?instance.phone,
      'licenceNo': ?instance.licenceNo,
      'licenceExpiry': ?instance.licenceExpiry?.toIso8601String(),
      'defaultVehicleId': ?instance.defaultVehicleId,
      'status': ?_$DriverStatusEnumMap[instance.status],
    };

const _$DriverStatusEnumMap = {
  DriverStatus.active: 'active',
  DriverStatus.onLeave: 'on_leave',
  DriverStatus.inactive: 'inactive',
};
