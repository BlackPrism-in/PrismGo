//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:copy_with_extension/copy_with_extension.dart';
import 'package:json_annotation/json_annotation.dart';

part 'conflict_dto.g.dart';

@CopyWith()
@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class ConflictDto {
  /// Returns a new [ConflictDto] instance.
  ConflictDto({
    required this.requestCode,

    required this.requestId,

    required this.from,

    required this.to,
  });

  @JsonKey(name: r'requestCode', required: true, includeIfNull: false)
  final String requestCode;

  @JsonKey(name: r'requestId', required: true, includeIfNull: false)
  final String requestId;

  @JsonKey(name: r'from', required: true, includeIfNull: false)
  final DateTime from;

  @JsonKey(name: r'to', required: true, includeIfNull: false)
  final DateTime to;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is ConflictDto &&
          other.requestCode == requestCode &&
          other.requestId == requestId &&
          other.from == from &&
          other.to == to;

  @override
  int get hashCode =>
      requestCode.hashCode + requestId.hashCode + from.hashCode + to.hashCode;

  factory ConflictDto.fromJson(Map<String, dynamic> json) =>
      _$ConflictDtoFromJson(json);

  Map<String, dynamic> toJson() => _$ConflictDtoToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }
}
