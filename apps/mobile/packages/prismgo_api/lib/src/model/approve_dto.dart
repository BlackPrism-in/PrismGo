//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:copy_with_extension/copy_with_extension.dart';
import 'package:json_annotation/json_annotation.dart';

part 'approve_dto.g.dart';

@CopyWith()
@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class ApproveDto {
  /// Returns a new [ApproveDto] instance.
  ApproveDto({this.comment});

  @JsonKey(name: r'comment', required: false, includeIfNull: false)
  final String? comment;

  @override
  bool operator ==(Object other) =>
      identical(this, other) || other is ApproveDto && other.comment == comment;

  @override
  int get hashCode => comment.hashCode;

  factory ApproveDto.fromJson(Map<String, dynamic> json) =>
      _$ApproveDtoFromJson(json);

  Map<String, dynamic> toJson() => _$ApproveDtoToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }
}
