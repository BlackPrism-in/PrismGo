// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'create_driver_dto.dart';

// **************************************************************************
// CopyWithGenerator
// **************************************************************************

abstract class _$CreateDriverDtoCWProxy {
  CreateDriverDto name(String name);

  CreateDriverDto phone(String phone);

  CreateDriverDto licenceNo(String licenceNo);

  CreateDriverDto licenceExpiry(DateTime? licenceExpiry);

  CreateDriverDto defaultVehicleId(String? defaultVehicleId);

  /// This function **does support** nullification of nullable fields. All `null` values passed to `non-nullable` fields will be ignored. You can also use `CreateDriverDto(...).copyWith.fieldName(...)` to override fields one at a time with nullification support.
  ///
  /// Usage
  /// ```dart
  /// CreateDriverDto(...).copyWith(id: 12, name: "My name")
  /// ````
  CreateDriverDto call({
    String name,
    String phone,
    String licenceNo,
    DateTime? licenceExpiry,
    String? defaultVehicleId,
  });
}

/// Proxy class for `copyWith` functionality. This is a callable class and can be used as follows: `instanceOfCreateDriverDto.copyWith(...)`. Additionally contains functions for specific fields e.g. `instanceOfCreateDriverDto.copyWith.fieldName(...)`
class _$CreateDriverDtoCWProxyImpl implements _$CreateDriverDtoCWProxy {
  const _$CreateDriverDtoCWProxyImpl(this._value);

  final CreateDriverDto _value;

  @override
  CreateDriverDto name(String name) => this(name: name);

  @override
  CreateDriverDto phone(String phone) => this(phone: phone);

  @override
  CreateDriverDto licenceNo(String licenceNo) => this(licenceNo: licenceNo);

  @override
  CreateDriverDto licenceExpiry(DateTime? licenceExpiry) =>
      this(licenceExpiry: licenceExpiry);

  @override
  CreateDriverDto defaultVehicleId(String? defaultVehicleId) =>
      this(defaultVehicleId: defaultVehicleId);

  @override
  /// This function **does support** nullification of nullable fields. All `null` values passed to `non-nullable` fields will be ignored. You can also use `CreateDriverDto(...).copyWith.fieldName(...)` to override fields one at a time with nullification support.
  ///
  /// Usage
  /// ```dart
  /// CreateDriverDto(...).copyWith(id: 12, name: "My name")
  /// ````
  CreateDriverDto call({
    Object? name = const $CopyWithPlaceholder(),
    Object? phone = const $CopyWithPlaceholder(),
    Object? licenceNo = const $CopyWithPlaceholder(),
    Object? licenceExpiry = const $CopyWithPlaceholder(),
    Object? defaultVehicleId = const $CopyWithPlaceholder(),
  }) {
    return CreateDriverDto(
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
      defaultVehicleId: defaultVehicleId == const $CopyWithPlaceholder()
          ? _value.defaultVehicleId
          // ignore: cast_nullable_to_non_nullable
          : defaultVehicleId as String?,
    );
  }
}

extension $CreateDriverDtoCopyWith on CreateDriverDto {
  /// Returns a callable class that can be used as follows: `instanceOfCreateDriverDto.copyWith(...)` or like so:`instanceOfCreateDriverDto.copyWith.fieldName(...)`.
  // ignore: library_private_types_in_public_api
  _$CreateDriverDtoCWProxy get copyWith => _$CreateDriverDtoCWProxyImpl(this);
}

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

CreateDriverDto _$CreateDriverDtoFromJson(Map<String, dynamic> json) =>
    $checkedCreate('CreateDriverDto', json, ($checkedConvert) {
      $checkKeys(json, requiredKeys: const ['name', 'phone', 'licenceNo']);
      final val = CreateDriverDto(
        name: $checkedConvert('name', (v) => v as String),
        phone: $checkedConvert('phone', (v) => v as String),
        licenceNo: $checkedConvert('licenceNo', (v) => v as String),
        licenceExpiry: $checkedConvert(
          'licenceExpiry',
          (v) => v == null ? null : DateTime.parse(v as String),
        ),
        defaultVehicleId: $checkedConvert(
          'defaultVehicleId',
          (v) => v as String?,
        ),
      );
      return val;
    });

Map<String, dynamic> _$CreateDriverDtoToJson(CreateDriverDto instance) =>
    <String, dynamic>{
      'name': instance.name,
      'phone': instance.phone,
      'licenceNo': instance.licenceNo,
      'licenceExpiry': ?instance.licenceExpiry?.toIso8601String(),
      'defaultVehicleId': ?instance.defaultVehicleId,
    };
