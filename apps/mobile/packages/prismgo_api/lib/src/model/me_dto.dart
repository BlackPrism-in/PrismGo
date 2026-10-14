//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:prismgo_api/src/model/me_department_dto.dart';
import 'package:prismgo_api/src/model/role.dart';
import 'package:copy_with_extension/copy_with_extension.dart';
import 'package:json_annotation/json_annotation.dart';

part 'me_dto.g.dart';

@CopyWith()
@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class MeDto {
  /// Returns a new [MeDto] instance.
  MeDto({
    required this.id,

    required this.name,

    required this.phone,

    this.email,

    required this.roles,

    this.department,

    required this.orgId,

    required this.orgName,
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

  @JsonKey(name: r'department', required: false, includeIfNull: false)
  final MeDepartmentDto? department;

  @JsonKey(name: r'orgId', required: true, includeIfNull: false)
  final String orgId;

  @JsonKey(name: r'orgName', required: true, includeIfNull: false)
  final String orgName;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is MeDto &&
          other.id == id &&
          other.name == name &&
          other.phone == phone &&
          other.email == email &&
          other.roles == roles &&
          other.department == department &&
          other.orgId == orgId &&
          other.orgName == orgName;

  @override
  int get hashCode =>
      id.hashCode +
      name.hashCode +
      phone.hashCode +
      (email == null ? 0 : email.hashCode) +
      roles.hashCode +
      (department == null ? 0 : department.hashCode) +
      orgId.hashCode +
      orgName.hashCode;

  factory MeDto.fromJson(Map<String, dynamic> json) => _$MeDtoFromJson(json);

  Map<String, dynamic> toJson() => _$MeDtoToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }
}
