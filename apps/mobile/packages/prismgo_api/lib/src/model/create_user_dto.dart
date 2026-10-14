//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:prismgo_api/src/model/role.dart';
import 'package:copy_with_extension/copy_with_extension.dart';
import 'package:json_annotation/json_annotation.dart';

part 'create_user_dto.g.dart';

@CopyWith()
@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class CreateUserDto {
  /// Returns a new [CreateUserDto] instance.
  CreateUserDto({
    required this.name,

    required this.phone,

    this.email,

    required this.roles,

    this.departmentId,
  });

  @JsonKey(name: r'name', required: true, includeIfNull: false)
  final String name;

  /// Indian mobile; stored as +91XXXXXXXXXX
  @JsonKey(name: r'phone', required: true, includeIfNull: false)
  final String phone;

  @JsonKey(name: r'email', required: false, includeIfNull: false)
  final String? email;

  @JsonKey(name: r'roles', required: true, includeIfNull: false)
  final List<Role> roles;

  @JsonKey(name: r'departmentId', required: false, includeIfNull: false)
  final String? departmentId;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is CreateUserDto &&
          other.name == name &&
          other.phone == phone &&
          other.email == email &&
          other.roles == roles &&
          other.departmentId == departmentId;

  @override
  int get hashCode =>
      name.hashCode +
      phone.hashCode +
      (email == null ? 0 : email.hashCode) +
      roles.hashCode +
      (departmentId == null ? 0 : departmentId.hashCode);

  factory CreateUserDto.fromJson(Map<String, dynamic> json) =>
      _$CreateUserDtoFromJson(json);

  Map<String, dynamic> toJson() => _$CreateUserDtoToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }
}
