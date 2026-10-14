// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'user_department_dto.dart';

// **************************************************************************
// CopyWithGenerator
// **************************************************************************

abstract class _$UserDepartmentDtoCWProxy {
  UserDepartmentDto id(String id);

  UserDepartmentDto name(String name);

  /// This function **does support** nullification of nullable fields. All `null` values passed to `non-nullable` fields will be ignored. You can also use `UserDepartmentDto(...).copyWith.fieldName(...)` to override fields one at a time with nullification support.
  ///
  /// Usage
  /// ```dart
  /// UserDepartmentDto(...).copyWith(id: 12, name: "My name")
  /// ````
  UserDepartmentDto call({String id, String name});
}

/// Proxy class for `copyWith` functionality. This is a callable class and can be used as follows: `instanceOfUserDepartmentDto.copyWith(...)`. Additionally contains functions for specific fields e.g. `instanceOfUserDepartmentDto.copyWith.fieldName(...)`
class _$UserDepartmentDtoCWProxyImpl implements _$UserDepartmentDtoCWProxy {
  const _$UserDepartmentDtoCWProxyImpl(this._value);

  final UserDepartmentDto _value;

  @override
  UserDepartmentDto id(String id) => this(id: id);

  @override
  UserDepartmentDto name(String name) => this(name: name);

  @override
  /// This function **does support** nullification of nullable fields. All `null` values passed to `non-nullable` fields will be ignored. You can also use `UserDepartmentDto(...).copyWith.fieldName(...)` to override fields one at a time with nullification support.
  ///
  /// Usage
  /// ```dart
  /// UserDepartmentDto(...).copyWith(id: 12, name: "My name")
  /// ````
  UserDepartmentDto call({
    Object? id = const $CopyWithPlaceholder(),
    Object? name = const $CopyWithPlaceholder(),
  }) {
    return UserDepartmentDto(
      id: id == const $CopyWithPlaceholder()
          ? _value.id
          // ignore: cast_nullable_to_non_nullable
          : id as String,
      name: name == const $CopyWithPlaceholder()
          ? _value.name
          // ignore: cast_nullable_to_non_nullable
          : name as String,
    );
  }
}

extension $UserDepartmentDtoCopyWith on UserDepartmentDto {
  /// Returns a callable class that can be used as follows: `instanceOfUserDepartmentDto.copyWith(...)` or like so:`instanceOfUserDepartmentDto.copyWith.fieldName(...)`.
  // ignore: library_private_types_in_public_api
  _$UserDepartmentDtoCWProxy get copyWith =>
      _$UserDepartmentDtoCWProxyImpl(this);
}

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

UserDepartmentDto _$UserDepartmentDtoFromJson(Map<String, dynamic> json) =>
    $checkedCreate('UserDepartmentDto', json, ($checkedConvert) {
      $checkKeys(json, requiredKeys: const ['id', 'name']);
      final val = UserDepartmentDto(
        id: $checkedConvert('id', (v) => v as String),
        name: $checkedConvert('name', (v) => v as String),
      );
      return val;
    });

Map<String, dynamic> _$UserDepartmentDtoToJson(UserDepartmentDto instance) =>
    <String, dynamic>{'id': instance.id, 'name': instance.name};
