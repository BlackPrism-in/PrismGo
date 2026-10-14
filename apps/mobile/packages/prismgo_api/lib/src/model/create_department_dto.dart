//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:copy_with_extension/copy_with_extension.dart';
import 'package:json_annotation/json_annotation.dart';

part 'create_department_dto.g.dart';

@CopyWith()
@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class CreateDepartmentDto {
  /// Returns a new [CreateDepartmentDto] instance.
  CreateDepartmentDto({required this.name, this.costCentre, this.hodUserId});

  @JsonKey(name: r'name', required: true, includeIfNull: false)
  final String name;

  @JsonKey(name: r'costCentre', required: false, includeIfNull: false)
  final String? costCentre;

  /// User id of the HOD; the user must hold the hod role
  @JsonKey(name: r'hodUserId', required: false, includeIfNull: false)
  final String? hodUserId;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is CreateDepartmentDto &&
          other.name == name &&
          other.costCentre == costCentre &&
          other.hodUserId == hodUserId;

  @override
  int get hashCode =>
      name.hashCode +
      costCentre.hashCode +
      (hodUserId == null ? 0 : hodUserId.hashCode);

  factory CreateDepartmentDto.fromJson(Map<String, dynamic> json) =>
      _$CreateDepartmentDtoFromJson(json);

  Map<String, dynamic> toJson() => _$CreateDepartmentDtoToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }
}
