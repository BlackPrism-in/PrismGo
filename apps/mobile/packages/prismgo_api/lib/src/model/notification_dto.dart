//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:copy_with_extension/copy_with_extension.dart';
import 'package:json_annotation/json_annotation.dart';

part 'notification_dto.g.dart';

@CopyWith()
@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class NotificationDto {
  /// Returns a new [NotificationDto] instance.
  NotificationDto({
    required this.id,

    required this.template,

    required this.title,

    required this.body,

    this.requestId,

    this.readAt,

    required this.createdAt,
  });

  @JsonKey(name: r'id', required: true, includeIfNull: false)
  final String id;

  @JsonKey(name: r'template', required: true, includeIfNull: false)
  final String template;

  @JsonKey(name: r'title', required: true, includeIfNull: false)
  final String title;

  @JsonKey(name: r'body', required: true, includeIfNull: false)
  final String body;

  @JsonKey(name: r'requestId', required: false, includeIfNull: false)
  final String? requestId;

  @JsonKey(name: r'readAt', required: false, includeIfNull: false)
  final DateTime? readAt;

  @JsonKey(name: r'createdAt', required: true, includeIfNull: false)
  final DateTime createdAt;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is NotificationDto &&
          other.id == id &&
          other.template == template &&
          other.title == title &&
          other.body == body &&
          other.requestId == requestId &&
          other.readAt == readAt &&
          other.createdAt == createdAt;

  @override
  int get hashCode =>
      id.hashCode +
      template.hashCode +
      title.hashCode +
      body.hashCode +
      (requestId == null ? 0 : requestId.hashCode) +
      (readAt == null ? 0 : readAt.hashCode) +
      createdAt.hashCode;

  factory NotificationDto.fromJson(Map<String, dynamic> json) =>
      _$NotificationDtoFromJson(json);

  Map<String, dynamic> toJson() => _$NotificationDtoToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }
}
