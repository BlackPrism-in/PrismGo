//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:copy_with_extension/copy_with_extension.dart';
import 'package:json_annotation/json_annotation.dart';

part 'reject_dto.g.dart';

@CopyWith()
@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class RejectDto {
  /// Returns a new [RejectDto] instance.
  RejectDto({required this.comment});

  @JsonKey(name: r'comment', required: true, includeIfNull: false)
  final String comment;

  @override
  bool operator ==(Object other) =>
      identical(this, other) || other is RejectDto && other.comment == comment;

  @override
  int get hashCode => comment.hashCode;

  factory RejectDto.fromJson(Map<String, dynamic> json) =>
      _$RejectDtoFromJson(json);

  Map<String, dynamic> toJson() => _$RejectDtoToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }
}
