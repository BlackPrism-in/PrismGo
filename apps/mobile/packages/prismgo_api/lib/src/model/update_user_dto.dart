//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:prismgo_api/src/model/user_status.dart';
import 'package:prismgo_api/src/model/role.dart';
import 'package:copy_with_extension/copy_with_extension.dart';
import 'package:json_annotation/json_annotation.dart';

part 'update_user_dto.g.dart';

@CopyWith()
@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class UpdateUserDto {
  /// Returns a new [UpdateUserDto] instance.
  UpdateUserDto({
    this.name,

    this.phone,

    this.email,

    this.roles,

    this.departmentId,

    this.status,
  });

  @JsonKey(name: r'name', required: false, includeIfNull: false)
  final String? name;

  /// Indian mobile; stored as +91XXXXXXXXXX
  @JsonKey(name: r'phone', required: false, includeIfNull: false)
  final String? phone;

  @JsonKey(name: r'email', required: false, includeIfNull: false)
  final String? email;

  @JsonKey(name: r'roles', required: false, includeIfNull: false)
  final List<Role>? roles;

  @JsonKey(name: r'departmentId', required: false, includeIfNull: false)
  final String? departmentId;

  @JsonKey(name: r'status', required: false, includeIfNull: false)
  final UserStatus? status;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is UpdateUserDto &&
          other.name == name &&
          other.phone == phone &&
          other.email == email &&
          other.roles == roles &&
          other.departmentId == departmentId &&
          other.status == status;

  @override
  int get hashCode =>
      name.hashCode +
      phone.hashCode +
      (email == null ? 0 : email.hashCode) +
      roles.hashCode +
      (departmentId == null ? 0 : departmentId.hashCode) +
      status.hashCode;

  factory UpdateUserDto.fromJson(Map<String, dynamic> json) =>
      _$UpdateUserDtoFromJson(json);

  Map<String, dynamic> toJson() => _$UpdateUserDtoToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }
}
