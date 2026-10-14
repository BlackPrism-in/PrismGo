//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:copy_with_extension/copy_with_extension.dart';
import 'package:json_annotation/json_annotation.dart';

part 'department_hod_dto.g.dart';

@CopyWith()
@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class DepartmentHodDto {
  /// Returns a new [DepartmentHodDto] instance.
  DepartmentHodDto({required this.id, required this.name, required this.phone});

  @JsonKey(name: r'id', required: true, includeIfNull: false)
  final String id;

  @JsonKey(name: r'name', required: true, includeIfNull: false)
  final String name;

  @JsonKey(name: r'phone', required: true, includeIfNull: false)
  final String phone;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is DepartmentHodDto &&
          other.id == id &&
          other.name == name &&
          other.phone == phone;

  @override
  int get hashCode => id.hashCode + name.hashCode + phone.hashCode;

  factory DepartmentHodDto.fromJson(Map<String, dynamic> json) =>
      _$DepartmentHodDtoFromJson(json);

  Map<String, dynamic> toJson() => _$DepartmentHodDtoToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }
}
