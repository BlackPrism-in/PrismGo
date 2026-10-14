// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'department_hod_dto.dart';

// **************************************************************************
// CopyWithGenerator
// **************************************************************************

abstract class _$DepartmentHodDtoCWProxy {
  DepartmentHodDto id(String id);

  DepartmentHodDto name(String name);

  DepartmentHodDto phone(String phone);

  /// This function **does support** nullification of nullable fields. All `null` values passed to `non-nullable` fields will be ignored. You can also use `DepartmentHodDto(...).copyWith.fieldName(...)` to override fields one at a time with nullification support.
  ///
  /// Usage
  /// ```dart
  /// DepartmentHodDto(...).copyWith(id: 12, name: "My name")
  /// ````
  DepartmentHodDto call({String id, String name, String phone});
}

/// Proxy class for `copyWith` functionality. This is a callable class and can be used as follows: `instanceOfDepartmentHodDto.copyWith(...)`. Additionally contains functions for specific fields e.g. `instanceOfDepartmentHodDto.copyWith.fieldName(...)`
class _$DepartmentHodDtoCWProxyImpl implements _$DepartmentHodDtoCWProxy {
  const _$DepartmentHodDtoCWProxyImpl(this._value);

  final DepartmentHodDto _value;

  @override
  DepartmentHodDto id(String id) => this(id: id);

  @override
  DepartmentHodDto name(String name) => this(name: name);

  @override
  DepartmentHodDto phone(String phone) => this(phone: phone);

  @override
  /// This function **does support** nullification of nullable fields. All `null` values passed to `non-nullable` fields will be ignored. You can also use `DepartmentHodDto(...).copyWith.fieldName(...)` to override fields one at a time with nullification support.
  ///
  /// Usage
  /// ```dart
  /// DepartmentHodDto(...).copyWith(id: 12, name: "My name")
  /// ````
  DepartmentHodDto call({
    Object? id = const $CopyWithPlaceholder(),
    Object? name = const $CopyWithPlaceholder(),
    Object? phone = const $CopyWithPlaceholder(),
  }) {
    return DepartmentHodDto(
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
    );
  }
}

extension $DepartmentHodDtoCopyWith on DepartmentHodDto {
  /// Returns a callable class that can be used as follows: `instanceOfDepartmentHodDto.copyWith(...)` or like so:`instanceOfDepartmentHodDto.copyWith.fieldName(...)`.
  // ignore: library_private_types_in_public_api
  _$DepartmentHodDtoCWProxy get copyWith => _$DepartmentHodDtoCWProxyImpl(this);
}

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

DepartmentHodDto _$DepartmentHodDtoFromJson(Map<String, dynamic> json) =>
    $checkedCreate('DepartmentHodDto', json, ($checkedConvert) {
      $checkKeys(json, requiredKeys: const ['id', 'name', 'phone']);
      final val = DepartmentHodDto(
        id: $checkedConvert('id', (v) => v as String),
        name: $checkedConvert('name', (v) => v as String),
        phone: $checkedConvert('phone', (v) => v as String),
      );
      return val;
    });

Map<String, dynamic> _$DepartmentHodDtoToJson(DepartmentHodDto instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'phone': instance.phone,
    };
