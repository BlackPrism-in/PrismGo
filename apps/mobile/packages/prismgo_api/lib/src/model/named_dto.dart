//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:copy_with_extension/copy_with_extension.dart';
import 'package:json_annotation/json_annotation.dart';

part 'named_dto.g.dart';

@CopyWith()
@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class NamedDto {
  /// Returns a new [NamedDto] instance.
  NamedDto({required this.id, required this.name});

  @JsonKey(name: r'id', required: true, includeIfNull: false)
  final String id;

  @JsonKey(name: r'name', required: true, includeIfNull: false)
  final String name;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is NamedDto && other.id == id && other.name == name;

  @override
  int get hashCode => id.hashCode + name.hashCode;

  factory NamedDto.fromJson(Map<String, dynamic> json) =>
      _$NamedDtoFromJson(json);

  Map<String, dynamic> toJson() => _$NamedDtoToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }
}
