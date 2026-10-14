// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'update_user_dto.dart';

// **************************************************************************
// CopyWithGenerator
// **************************************************************************

abstract class _$UpdateUserDtoCWProxy {
  UpdateUserDto name(String? name);

  UpdateUserDto phone(String? phone);

  UpdateUserDto email(String? email);

  UpdateUserDto roles(List<Role>? roles);

  UpdateUserDto departmentId(String? departmentId);

  UpdateUserDto status(UserStatus? status);

  /// This function **does support** nullification of nullable fields. All `null` values passed to `non-nullable` fields will be ignored. You can also use `UpdateUserDto(...).copyWith.fieldName(...)` to override fields one at a time with nullification support.
  ///
  /// Usage
  /// ```dart
  /// UpdateUserDto(...).copyWith(id: 12, name: "My name")
  /// ````
  UpdateUserDto call({
    String? name,
    String? phone,
    String? email,
    List<Role>? roles,
    String? departmentId,
    UserStatus? status,
  });
}

/// Proxy class for `copyWith` functionality. This is a callable class and can be used as follows: `instanceOfUpdateUserDto.copyWith(...)`. Additionally contains functions for specific fields e.g. `instanceOfUpdateUserDto.copyWith.fieldName(...)`
class _$UpdateUserDtoCWProxyImpl implements _$UpdateUserDtoCWProxy {
  const _$UpdateUserDtoCWProxyImpl(this._value);

  final UpdateUserDto _value;

  @override
  UpdateUserDto name(String? name) => this(name: name);

  @override
  UpdateUserDto phone(String? phone) => this(phone: phone);

  @override
  UpdateUserDto email(String? email) => this(email: email);

  @override
  UpdateUserDto roles(List<Role>? roles) => this(roles: roles);

  @override
  UpdateUserDto departmentId(String? departmentId) =>
      this(departmentId: departmentId);

  @override
  UpdateUserDto status(UserStatus? status) => this(status: status);

  @override
  /// This function **does support** nullification of nullable fields. All `null` values passed to `non-nullable` fields will be ignored. You can also use `UpdateUserDto(...).copyWith.fieldName(...)` to override fields one at a time with nullification support.
  ///
  /// Usage
  /// ```dart
  /// UpdateUserDto(...).copyWith(id: 12, name: "My name")
  /// ````
  UpdateUserDto call({
    Object? name = const $CopyWithPlaceholder(),
    Object? phone = const $CopyWithPlaceholder(),
    Object? email = const $CopyWithPlaceholder(),
    Object? roles = const $CopyWithPlaceholder(),
    Object? departmentId = const $CopyWithPlaceholder(),
    Object? status = const $CopyWithPlaceholder(),
  }) {
    return UpdateUserDto(
      name: name == const $CopyWithPlaceholder()
          ? _value.name
          // ignore: cast_nullable_to_non_nullable
          : name as String?,
      phone: phone == const $CopyWithPlaceholder()
          ? _value.phone
          // ignore: cast_nullable_to_non_nullable
          : phone as String?,
      email: email == const $CopyWithPlaceholder()
          ? _value.email
          // ignore: cast_nullable_to_non_nullable
          : email as String?,
      roles: roles == const $CopyWithPlaceholder()
          ? _value.roles
          // ignore: cast_nullable_to_non_nullable
          : roles as List<Role>?,
      departmentId: departmentId == const $CopyWithPlaceholder()
          ? _value.departmentId
          // ignore: cast_nullable_to_non_nullable
          : departmentId as String?,
      status: status == const $CopyWithPlaceholder()
          ? _value.status
          // ignore: cast_nullable_to_non_nullable
          : status as UserStatus?,
    );
  }
}

extension $UpdateUserDtoCopyWith on UpdateUserDto {
  /// Returns a callable class that can be used as follows: `instanceOfUpdateUserDto.copyWith(...)` or like so:`instanceOfUpdateUserDto.copyWith.fieldName(...)`.
  // ignore: library_private_types_in_public_api
  _$UpdateUserDtoCWProxy get copyWith => _$UpdateUserDtoCWProxyImpl(this);
}

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

UpdateUserDto _$UpdateUserDtoFromJson(Map<String, dynamic> json) =>
    $checkedCreate('UpdateUserDto', json, ($checkedConvert) {
      final val = UpdateUserDto(
        name: $checkedConvert('name', (v) => v as String?),
        phone: $checkedConvert('phone', (v) => v as String?),
        email: $checkedConvert('email', (v) => v as String?),
        roles: $checkedConvert(
          'roles',
          (v) => (v as List<dynamic>?)
              ?.map((e) => $enumDecode(_$RoleEnumMap, e))
              .toList(),
        ),
        departmentId: $checkedConvert('departmentId', (v) => v as String?),
        status: $checkedConvert(
          'status',
          (v) => $enumDecodeNullable(_$UserStatusEnumMap, v),
        ),
      );
      return val;
    });

Map<String, dynamic> _$UpdateUserDtoToJson(UpdateUserDto instance) =>
    <String, dynamic>{
      'name': ?instance.name,
      'phone': ?instance.phone,
      'email': ?instance.email,
      'roles': ?instance.roles?.map((e) => _$RoleEnumMap[e]!).toList(),
      'departmentId': ?instance.departmentId,
      'status': ?_$UserStatusEnumMap[instance.status],
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
