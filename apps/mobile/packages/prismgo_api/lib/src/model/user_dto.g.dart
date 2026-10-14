// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'user_dto.dart';

// **************************************************************************
// CopyWithGenerator
// **************************************************************************

abstract class _$UserDtoCWProxy {
  UserDto id(String id);

  UserDto name(String name);

  UserDto phone(String phone);

  UserDto email(String? email);

  UserDto roles(List<Role> roles);

  UserDto status(UserStatus status);

  UserDto department(UserDepartmentDto? department);

  UserDto lastLoginAt(DateTime? lastLoginAt);

  /// This function **does support** nullification of nullable fields. All `null` values passed to `non-nullable` fields will be ignored. You can also use `UserDto(...).copyWith.fieldName(...)` to override fields one at a time with nullification support.
  ///
  /// Usage
  /// ```dart
  /// UserDto(...).copyWith(id: 12, name: "My name")
  /// ````
  UserDto call({
    String id,
    String name,
    String phone,
    String? email,
    List<Role> roles,
    UserStatus status,
    UserDepartmentDto? department,
    DateTime? lastLoginAt,
  });
}

/// Proxy class for `copyWith` functionality. This is a callable class and can be used as follows: `instanceOfUserDto.copyWith(...)`. Additionally contains functions for specific fields e.g. `instanceOfUserDto.copyWith.fieldName(...)`
class _$UserDtoCWProxyImpl implements _$UserDtoCWProxy {
  const _$UserDtoCWProxyImpl(this._value);

  final UserDto _value;

  @override
  UserDto id(String id) => this(id: id);

  @override
  UserDto name(String name) => this(name: name);

  @override
  UserDto phone(String phone) => this(phone: phone);

  @override
  UserDto email(String? email) => this(email: email);

  @override
  UserDto roles(List<Role> roles) => this(roles: roles);

  @override
  UserDto status(UserStatus status) => this(status: status);

  @override
  UserDto department(UserDepartmentDto? department) =>
      this(department: department);

  @override
  UserDto lastLoginAt(DateTime? lastLoginAt) => this(lastLoginAt: lastLoginAt);

  @override
  /// This function **does support** nullification of nullable fields. All `null` values passed to `non-nullable` fields will be ignored. You can also use `UserDto(...).copyWith.fieldName(...)` to override fields one at a time with nullification support.
  ///
  /// Usage
  /// ```dart
  /// UserDto(...).copyWith(id: 12, name: "My name")
  /// ````
  UserDto call({
    Object? id = const $CopyWithPlaceholder(),
    Object? name = const $CopyWithPlaceholder(),
    Object? phone = const $CopyWithPlaceholder(),
    Object? email = const $CopyWithPlaceholder(),
    Object? roles = const $CopyWithPlaceholder(),
    Object? status = const $CopyWithPlaceholder(),
    Object? department = const $CopyWithPlaceholder(),
    Object? lastLoginAt = const $CopyWithPlaceholder(),
  }) {
    return UserDto(
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
      email: email == const $CopyWithPlaceholder()
          ? _value.email
          // ignore: cast_nullable_to_non_nullable
          : email as String?,
      roles: roles == const $CopyWithPlaceholder()
          ? _value.roles
          // ignore: cast_nullable_to_non_nullable
          : roles as List<Role>,
      status: status == const $CopyWithPlaceholder()
          ? _value.status
          // ignore: cast_nullable_to_non_nullable
          : status as UserStatus,
      department: department == const $CopyWithPlaceholder()
          ? _value.department
          // ignore: cast_nullable_to_non_nullable
          : department as UserDepartmentDto?,
      lastLoginAt: lastLoginAt == const $CopyWithPlaceholder()
          ? _value.lastLoginAt
          // ignore: cast_nullable_to_non_nullable
          : lastLoginAt as DateTime?,
    );
  }
}

extension $UserDtoCopyWith on UserDto {
  /// Returns a callable class that can be used as follows: `instanceOfUserDto.copyWith(...)` or like so:`instanceOfUserDto.copyWith.fieldName(...)`.
  // ignore: library_private_types_in_public_api
  _$UserDtoCWProxy get copyWith => _$UserDtoCWProxyImpl(this);
}

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

UserDto _$UserDtoFromJson(Map<String, dynamic> json) =>
    $checkedCreate('UserDto', json, ($checkedConvert) {
      $checkKeys(
        json,
        requiredKeys: const ['id', 'name', 'phone', 'roles', 'status'],
      );
      final val = UserDto(
        id: $checkedConvert('id', (v) => v as String),
        name: $checkedConvert('name', (v) => v as String),
        phone: $checkedConvert('phone', (v) => v as String),
        email: $checkedConvert('email', (v) => v as String?),
        roles: $checkedConvert(
          'roles',
          (v) => (v as List<dynamic>)
              .map((e) => $enumDecode(_$RoleEnumMap, e))
              .toList(),
        ),
        status: $checkedConvert(
          'status',
          (v) => $enumDecode(_$UserStatusEnumMap, v),
        ),
        department: $checkedConvert(
          'department',
          (v) => v == null
              ? null
              : UserDepartmentDto.fromJson(v as Map<String, dynamic>),
        ),
        lastLoginAt: $checkedConvert(
          'lastLoginAt',
          (v) => v == null ? null : DateTime.parse(v as String),
        ),
      );
      return val;
    });

Map<String, dynamic> _$UserDtoToJson(UserDto instance) => <String, dynamic>{
  'id': instance.id,
  'name': instance.name,
  'phone': instance.phone,
  'email': ?instance.email,
  'roles': instance.roles.map((e) => _$RoleEnumMap[e]!).toList(),
  'status': _$UserStatusEnumMap[instance.status]!,
  'department': ?instance.department?.toJson(),
  'lastLoginAt': ?instance.lastLoginAt?.toIso8601String(),
};

const _$RoleEnumMap = {
  Role.requester: 'requester',
  Role.hod: 'hod',
  Role.transportManager: 'transport_manager',
  Role.superAdmin: 'super_admin',
};

const _$UserStatusEnumMap = {
  UserStatus.active: 'active',
  UserStatus.inactive: 'inactive',
};
