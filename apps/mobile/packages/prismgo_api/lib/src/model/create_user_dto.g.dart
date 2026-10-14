// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'create_user_dto.dart';

// **************************************************************************
// CopyWithGenerator
// **************************************************************************

abstract class _$CreateUserDtoCWProxy {
  CreateUserDto name(String name);

  CreateUserDto phone(String phone);

  CreateUserDto email(String? email);

  CreateUserDto roles(List<Role> roles);

  CreateUserDto departmentId(String? departmentId);

  /// This function **does support** nullification of nullable fields. All `null` values passed to `non-nullable` fields will be ignored. You can also use `CreateUserDto(...).copyWith.fieldName(...)` to override fields one at a time with nullification support.
  ///
  /// Usage
  /// ```dart
  /// CreateUserDto(...).copyWith(id: 12, name: "My name")
  /// ````
  CreateUserDto call({
    String name,
    String phone,
    String? email,
    List<Role> roles,
    String? departmentId,
  });
}

/// Proxy class for `copyWith` functionality. This is a callable class and can be used as follows: `instanceOfCreateUserDto.copyWith(...)`. Additionally contains functions for specific fields e.g. `instanceOfCreateUserDto.copyWith.fieldName(...)`
class _$CreateUserDtoCWProxyImpl implements _$CreateUserDtoCWProxy {
  const _$CreateUserDtoCWProxyImpl(this._value);

  final CreateUserDto _value;

  @override
  CreateUserDto name(String name) => this(name: name);

  @override
  CreateUserDto phone(String phone) => this(phone: phone);

  @override
  CreateUserDto email(String? email) => this(email: email);

  @override
  CreateUserDto roles(List<Role> roles) => this(roles: roles);

  @override
  CreateUserDto departmentId(String? departmentId) =>
      this(departmentId: departmentId);

  @override
  /// This function **does support** nullification of nullable fields. All `null` values passed to `non-nullable` fields will be ignored. You can also use `CreateUserDto(...).copyWith.fieldName(...)` to override fields one at a time with nullification support.
  ///
  /// Usage
  /// ```dart
  /// CreateUserDto(...).copyWith(id: 12, name: "My name")
  /// ````
  CreateUserDto call({
    Object? name = const $CopyWithPlaceholder(),
    Object? phone = const $CopyWithPlaceholder(),
    Object? email = const $CopyWithPlaceholder(),
    Object? roles = const $CopyWithPlaceholder(),
    Object? departmentId = const $CopyWithPlaceholder(),
  }) {
    return CreateUserDto(
      name: name == const $CopyWithPlaceholder()
          ? _value.name
          // ignore: cast_nullable_to_non_nullable
          : name as String,
      phone: phone == const $CopyWithPlaceholder()
          ? _value.phone
          // ignore: cast_nullable_to_non_nullable
          : phone as String,
      email: email == const $CopyWithPlaceholder()
          ? _value.email
          // ignore: cast_nullable_to_non_nullable
          : email as String?,
      roles: roles == const $CopyWithPlaceholder()
          ? _value.roles
          // ignore: cast_nullable_to_non_nullable
          : roles as List<Role>,
      departmentId: departmentId == const $CopyWithPlaceholder()
          ? _value.departmentId
          // ignore: cast_nullable_to_non_nullable
          : departmentId as String?,
    );
  }
}

extension $CreateUserDtoCopyWith on CreateUserDto {
  /// Returns a callable class that can be used as follows: `instanceOfCreateUserDto.copyWith(...)` or like so:`instanceOfCreateUserDto.copyWith.fieldName(...)`.
  // ignore: library_private_types_in_public_api
  _$CreateUserDtoCWProxy get copyWith => _$CreateUserDtoCWProxyImpl(this);
}

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

CreateUserDto _$CreateUserDtoFromJson(Map<String, dynamic> json) =>
    $checkedCreate('CreateUserDto', json, ($checkedConvert) {
      $checkKeys(json, requiredKeys: const ['name', 'phone', 'roles']);
      final val = CreateUserDto(
        name: $checkedConvert('name', (v) => v as String),
        phone: $checkedConvert('phone', (v) => v as String),
        email: $checkedConvert('email', (v) => v as String?),
        roles: $checkedConvert(
          'roles',
          (v) => (v as List<dynamic>)
              .map((e) => $enumDecode(_$RoleEnumMap, e))
              .toList(),
        ),
        departmentId: $checkedConvert('departmentId', (v) => v as String?),
      );
      return val;
    });

Map<String, dynamic> _$CreateUserDtoToJson(CreateUserDto instance) =>
    <String, dynamic>{
      'name': instance.name,
      'phone': instance.phone,
      'email': ?instance.email,
      'roles': instance.roles.map((e) => _$RoleEnumMap[e]!).toList(),
      'departmentId': ?instance.departmentId,
    };

const _$RoleEnumMap = {
  Role.requester: 'requester',
  Role.hod: 'hod',
  Role.transportManager: 'transport_manager',
  Role.superAdmin: 'super_admin',
};
