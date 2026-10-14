//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:prismgo_api/src/model/user_status.dart';
import 'package:prismgo_api/src/model/role.dart';
import 'package:prismgo_api/src/model/user_department_dto.dart';
import 'package:copy_with_extension/copy_with_extension.dart';
import 'package:json_annotation/json_annotation.dart';

part 'user_dto.g.dart';

@CopyWith()
@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class UserDto {
  /// Returns a new [UserDto] instance.
  UserDto({
    required this.id,

    required this.name,

    required this.phone,

    this.email,

    required this.roles,

    required this.status,

    this.department,

    this.lastLoginAt,
  });

  @JsonKey(name: r'id', required: true, includeIfNull: false)
  final String id;

  @JsonKey(name: r'name', required: true, includeIfNull: false)
  final String name;

  @JsonKey(name: r'phone', required: true, includeIfNull: false)
  final String phone;

  @JsonKey(name: r'email', required: false, includeIfNull: false)
  final String? email;

  @JsonKey(name: r'roles', required: true, includeIfNull: false)
  final List<Role> roles;

  @JsonKey(name: r'status', required: true, includeIfNull: false)
  final UserStatus status;

  @JsonKey(name: r'department', required: false, includeIfNull: false)
  final UserDepartmentDto? department;

  @JsonKey(name: r'lastLoginAt', required: false, includeIfNull: false)
  final DateTime? lastLoginAt;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is UserDto &&
          other.id == id &&
          other.name == name &&
          other.phone == phone &&
          other.email == email &&
          other.roles == roles &&
          other.status == status &&
          other.department == department &&
          other.lastLoginAt == lastLoginAt;

  @override
  int get hashCode =>
      id.hashCode +
      name.hashCode +
      phone.hashCode +
      (email == null ? 0 : email.hashCode) +
      roles.hashCode +
      status.hashCode +
      (department == null ? 0 : department.hashCode) +
      (lastLoginAt == null ? 0 : lastLoginAt.hashCode);

  factory UserDto.fromJson(Map<String, dynamic> json) =>
      _$UserDtoFromJson(json);

  Map<String, dynamic> toJson() => _$UserDtoToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }
}
