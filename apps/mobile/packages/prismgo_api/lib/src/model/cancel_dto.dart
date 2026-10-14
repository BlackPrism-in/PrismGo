//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:copy_with_extension/copy_with_extension.dart';
import 'package:json_annotation/json_annotation.dart';

part 'cancel_dto.g.dart';

@CopyWith()
@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class CancelDto {
  /// Returns a new [CancelDto] instance.
  CancelDto({this.reason});

  @JsonKey(name: r'reason', required: false, includeIfNull: false)
  final String? reason;

  @override
  bool operator ==(Object other) =>
      identical(this, other) || other is CancelDto && other.reason == reason;

  @override
  int get hashCode => reason.hashCode;

  factory CancelDto.fromJson(Map<String, dynamic> json) =>
      _$CancelDtoFromJson(json);

  Map<String, dynamic> toJson() => _$CancelDtoToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }
}
