//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:prismgo_api/src/model/department_hod_dto.dart';
import 'package:copy_with_extension/copy_with_extension.dart';
import 'package:json_annotation/json_annotation.dart';

part 'department_dto.g.dart';

@CopyWith()
@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class DepartmentDto {
  /// Returns a new [DepartmentDto] instance.
  DepartmentDto({
    required this.id,

    required this.name,

    this.costCentre,

    this.hod,

    required this.memberCount,
  });

  @JsonKey(name: r'id', required: true, includeIfNull: false)
  final String id;

  @JsonKey(name: r'name', required: true, includeIfNull: false)
  final String name;

  @JsonKey(name: r'costCentre', required: false, includeIfNull: false)
  final String? costCentre;

  @JsonKey(name: r'hod', required: false, includeIfNull: false)
  final DepartmentHodDto? hod;

  @JsonKey(name: r'memberCount', required: true, includeIfNull: false)
  final num memberCount;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is DepartmentDto &&
          other.id == id &&
          other.name == name &&
          other.costCentre == costCentre &&
          other.hod == hod &&
          other.memberCount == memberCount;

  @override
  int get hashCode =>
      id.hashCode +
      name.hashCode +
      (costCentre == null ? 0 : costCentre.hashCode) +
      (hod == null ? 0 : hod.hashCode) +
      memberCount.hashCode;

  factory DepartmentDto.fromJson(Map<String, dynamic> json) =>
      _$DepartmentDtoFromJson(json);

  Map<String, dynamic> toJson() => _$DepartmentDtoToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }
}
