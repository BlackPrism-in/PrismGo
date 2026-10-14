// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'available_driver_dto.dart';

// **************************************************************************
// CopyWithGenerator
// **************************************************************************

abstract class _$AvailableDriverDtoCWProxy {
  AvailableDriverDto id(String id);

  AvailableDriverDto name(String name);

  AvailableDriverDto phone(String phone);

  AvailableDriverDto defaultVehicleId(String? defaultVehicleId);

  AvailableDriverDto available(bool available);

  AvailableDriverDto conflict(ConflictDto? conflict);

  /// This function **does support** nullification of nullable fields. All `null` values passed to `non-nullable` fields will be ignored. You can also use `AvailableDriverDto(...).copyWith.fieldName(...)` to override fields one at a time with nullification support.
  ///
  /// Usage
  /// ```dart
  /// AvailableDriverDto(...).copyWith(id: 12, name: "My name")
  /// ````
  AvailableDriverDto call({
    String id,
    String name,
    String phone,
    String? defaultVehicleId,
    bool available,
    ConflictDto? conflict,
  });
}

/// Proxy class for `copyWith` functionality. This is a callable class and can be used as follows: `instanceOfAvailableDriverDto.copyWith(...)`. Additionally contains functions for specific fields e.g. `instanceOfAvailableDriverDto.copyWith.fieldName(...)`
class _$AvailableDriverDtoCWProxyImpl implements _$AvailableDriverDtoCWProxy {
  const _$AvailableDriverDtoCWProxyImpl(this._value);

  final AvailableDriverDto _value;

  @override
  AvailableDriverDto id(String id) => this(id: id);

  @override
  AvailableDriverDto name(String name) => this(name: name);

  @override
  AvailableDriverDto phone(String phone) => this(phone: phone);

  @override
  AvailableDriverDto defaultVehicleId(String? defaultVehicleId) =>
      this(defaultVehicleId: defaultVehicleId);

  @override
  AvailableDriverDto available(bool available) => this(available: available);

  @override
  AvailableDriverDto conflict(ConflictDto? conflict) =>
      this(conflict: conflict);

  @override
  /// This function **does support** nullification of nullable fields. All `null` values passed to `non-nullable` fields will be ignored. You can also use `AvailableDriverDto(...).copyWith.fieldName(...)` to override fields one at a time with nullification support.
  ///
  /// Usage
  /// ```dart
  /// AvailableDriverDto(...).copyWith(id: 12, name: "My name")
  /// ````
  AvailableDriverDto call({
    Object? id = const $CopyWithPlaceholder(),
    Object? name = const $CopyWithPlaceholder(),
    Object? phone = const $CopyWithPlaceholder(),
    Object? defaultVehicleId = const $CopyWithPlaceholder(),
    Object? available = const $CopyWithPlaceholder(),
    Object? conflict = const $CopyWithPlaceholder(),
  }) {
    return AvailableDriverDto(
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
      defaultVehicleId: defaultVehicleId == const $CopyWithPlaceholder()
          ? _value.defaultVehicleId
          // ignore: cast_nullable_to_non_nullable
          : defaultVehicleId as String?,
      available: available == const $CopyWithPlaceholder()
          ? _value.available
          // ignore: cast_nullable_to_non_nullable
          : available as bool,
      conflict: conflict == const $CopyWithPlaceholder()
          ? _value.conflict
          // ignore: cast_nullable_to_non_nullable
          : conflict as ConflictDto?,
    );
  }
}

extension $AvailableDriverDtoCopyWith on AvailableDriverDto {
  /// Returns a callable class that can be used as follows: `instanceOfAvailableDriverDto.copyWith(...)` or like so:`instanceOfAvailableDriverDto.copyWith.fieldName(...)`.
  // ignore: library_private_types_in_public_api
  _$AvailableDriverDtoCWProxy get copyWith =>
      _$AvailableDriverDtoCWProxyImpl(this);
}

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

AvailableDriverDto _$AvailableDriverDtoFromJson(
  Map<String, dynamic> json,
) => $checkedCreate('AvailableDriverDto', json, ($checkedConvert) {
  $checkKeys(json, requiredKeys: const ['id', 'name', 'phone', 'available']);
  final val = AvailableDriverDto(
    id: $checkedConvert('id', (v) => v as String),
    name: $checkedConvert('name', (v) => v as String),
    phone: $checkedConvert('phone', (v) => v as String),
    defaultVehicleId: $checkedConvert('defaultVehicleId', (v) => v as String?),
    available: $checkedConvert('available', (v) => v as bool),
    conflict: $checkedConvert(
      'conflict',
      (v) => v == null ? null : ConflictDto.fromJson(v as Map<String, dynamic>),
    ),
  );
  return val;
});

Map<String, dynamic> _$AvailableDriverDtoToJson(AvailableDriverDto instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'phone': instance.phone,
      'defaultVehicleId': ?instance.defaultVehicleId,
      'available': instance.available,
      'conflict': ?instance.conflict?.toJson(),
    };
