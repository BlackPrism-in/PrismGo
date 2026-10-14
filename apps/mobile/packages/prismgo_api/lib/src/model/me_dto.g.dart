// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'me_dto.dart';

// **************************************************************************
// CopyWithGenerator
// **************************************************************************

abstract class _$MeDtoCWProxy {
  MeDto id(String id);

  MeDto name(String name);

  MeDto phone(String phone);

  MeDto email(String? email);

  MeDto roles(List<Role> roles);

  MeDto department(MeDepartmentDto? department);

  MeDto orgId(String orgId);

  MeDto orgName(String orgName);

  /// This function **does support** nullification of nullable fields. All `null` values passed to `non-nullable` fields will be ignored. You can also use `MeDto(...).copyWith.fieldName(...)` to override fields one at a time with nullification support.
  ///
  /// Usage
  /// ```dart
  /// MeDto(...).copyWith(id: 12, name: "My name")
  /// ````
  MeDto call({
    String id,
    String name,
    String phone,
    String? email,
    List<Role> roles,
    MeDepartmentDto? department,
    String orgId,
    String orgName,
  });
}

/// Proxy class for `copyWith` functionality. This is a callable class and can be used as follows: `instanceOfMeDto.copyWith(...)`. Additionally contains functions for specific fields e.g. `instanceOfMeDto.copyWith.fieldName(...)`
class _$MeDtoCWProxyImpl implements _$MeDtoCWProxy {
  const _$MeDtoCWProxyImpl(this._value);

  final MeDto _value;

  @override
  MeDto id(String id) => this(id: id);

  @override
  MeDto name(String name) => this(name: name);

  @override
  MeDto phone(String phone) => this(phone: phone);

  @override
  MeDto email(String? email) => this(email: email);

  @override
  MeDto roles(List<Role> roles) => this(roles: roles);

  @override
  MeDto department(MeDepartmentDto? department) => this(department: department);

  @override
  MeDto orgId(String orgId) => this(orgId: orgId);

  @override
  MeDto orgName(String orgName) => this(orgName: orgName);

  @override
  /// This function **does support** nullification of nullable fields. All `null` values passed to `non-nullable` fields will be ignored. You can also use `MeDto(...).copyWith.fieldName(...)` to override fields one at a time with nullification support.
  ///
  /// Usage
  /// ```dart
  /// MeDto(...).copyWith(id: 12, name: "My name")
  /// ````
  MeDto call({
    Object? id = const $CopyWithPlaceholder(),
    Object? name = const $CopyWithPlaceholder(),
    Object? phone = const $CopyWithPlaceholder(),
    Object? email = const $CopyWithPlaceholder(),
    Object? roles = const $CopyWithPlaceholder(),
    Object? department = const $CopyWithPlaceholder(),
    Object? orgId = const $CopyWithPlaceholder(),
    Object? orgName = const $CopyWithPlaceholder(),
  }) {
    return MeDto(
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
      department: department == const $CopyWithPlaceholder()
          ? _value.department
          // ignore: cast_nullable_to_non_nullable
          : department as MeDepartmentDto?,
      orgId: orgId == const $CopyWithPlaceholder()
          ? _value.orgId
          // ignore: cast_nullable_to_non_nullable
          : orgId as String,
      orgName: orgName == const $CopyWithPlaceholder()
          ? _value.orgName
          // ignore: cast_nullable_to_non_nullable
          : orgName as String,
    );
  }
}

extension $MeDtoCopyWith on MeDto {
  /// Returns a callable class that can be used as follows: `instanceOfMeDto.copyWith(...)` or like so:`instanceOfMeDto.copyWith.fieldName(...)`.
  // ignore: library_private_types_in_public_api
  _$MeDtoCWProxy get copyWith => _$MeDtoCWProxyImpl(this);
}

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

MeDto _$MeDtoFromJson(Map<String, dynamic> json) => $checkedCreate(
  'MeDto',
  json,
  ($checkedConvert) {
    $checkKeys(
      json,
      requiredKeys: const ['id', 'name', 'phone', 'roles', 'orgId', 'orgName'],
    );
    final val = MeDto(
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
      department: $checkedConvert(
        'department',
        (v) => v == null
            ? null
            : MeDepartmentDto.fromJson(v as Map<String, dynamic>),
      ),
      orgId: $checkedConvert('orgId', (v) => v as String),
      orgName: $checkedConvert('orgName', (v) => v as String),
    );
    return val;
  },
);

Map<String, dynamic> _$MeDtoToJson(MeDto instance) => <String, dynamic>{
  'id': instance.id,
  'name': instance.name,
  'phone': instance.phone,
  'email': ?instance.email,
  'roles': instance.roles.map((e) => _$RoleEnumMap[e]!).toList(),
  'department': ?instance.department?.toJson(),
  'orgId': instance.orgId,
  'orgName': instance.orgName,
};

const _$RoleEnumMap = {
  Role.requester: 'requester',
  Role.hod: 'hod',
  Role.transportManager: 'transport_manager',
  Role.superAdmin: 'super_admin',
};
