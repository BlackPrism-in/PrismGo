//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:prismgo_api/src/model/timeline_type.dart';
import 'package:copy_with_extension/copy_with_extension.dart';
import 'package:json_annotation/json_annotation.dart';

part 'timeline_entry_dto.g.dart';

@CopyWith()
@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class TimelineEntryDto {
  /// Returns a new [TimelineEntryDto] instance.
  TimelineEntryDto({
    required this.type,

    required this.at,

    this.actorName,

    this.note,
  });

  @JsonKey(name: r'type', required: true, includeIfNull: false)
  final TimelineType type;

  @JsonKey(name: r'at', required: true, includeIfNull: false)
  final DateTime at;

  @JsonKey(name: r'actorName', required: false, includeIfNull: false)
  final String? actorName;

  @JsonKey(name: r'note', required: false, includeIfNull: false)
  final String? note;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is TimelineEntryDto &&
          other.type == type &&
          other.at == at &&
          other.actorName == actorName &&
          other.note == note;

  @override
  int get hashCode =>
      type.hashCode +
      at.hashCode +
      (actorName == null ? 0 : actorName.hashCode) +
      (note == null ? 0 : note.hashCode);

  factory TimelineEntryDto.fromJson(Map<String, dynamic> json) =>
      _$TimelineEntryDtoFromJson(json);

  Map<String, dynamic> toJson() => _$TimelineEntryDtoToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }
}
