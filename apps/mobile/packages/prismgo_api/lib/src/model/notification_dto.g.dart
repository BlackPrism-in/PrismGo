// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'notification_dto.dart';

// **************************************************************************
// CopyWithGenerator
// **************************************************************************

abstract class _$NotificationDtoCWProxy {
  NotificationDto id(String id);

  NotificationDto template(String template);

  NotificationDto title(String title);

  NotificationDto body(String body);

  NotificationDto requestId(String? requestId);

  NotificationDto readAt(DateTime? readAt);

  NotificationDto createdAt(DateTime createdAt);

  /// This function **does support** nullification of nullable fields. All `null` values passed to `non-nullable` fields will be ignored. You can also use `NotificationDto(...).copyWith.fieldName(...)` to override fields one at a time with nullification support.
  ///
  /// Usage
  /// ```dart
  /// NotificationDto(...).copyWith(id: 12, name: "My name")
  /// ````
  NotificationDto call({
    String id,
    String template,
    String title,
    String body,
    String? requestId,
    DateTime? readAt,
    DateTime createdAt,
  });
}

/// Proxy class for `copyWith` functionality. This is a callable class and can be used as follows: `instanceOfNotificationDto.copyWith(...)`. Additionally contains functions for specific fields e.g. `instanceOfNotificationDto.copyWith.fieldName(...)`
class _$NotificationDtoCWProxyImpl implements _$NotificationDtoCWProxy {
  const _$NotificationDtoCWProxyImpl(this._value);

  final NotificationDto _value;

  @override
  NotificationDto id(String id) => this(id: id);

  @override
  NotificationDto template(String template) => this(template: template);

  @override
  NotificationDto title(String title) => this(title: title);

  @override
  NotificationDto body(String body) => this(body: body);

  @override
  NotificationDto requestId(String? requestId) => this(requestId: requestId);

  @override
  NotificationDto readAt(DateTime? readAt) => this(readAt: readAt);

  @override
  NotificationDto createdAt(DateTime createdAt) => this(createdAt: createdAt);

  @override
  /// This function **does support** nullification of nullable fields. All `null` values passed to `non-nullable` fields will be ignored. You can also use `NotificationDto(...).copyWith.fieldName(...)` to override fields one at a time with nullification support.
  ///
  /// Usage
  /// ```dart
  /// NotificationDto(...).copyWith(id: 12, name: "My name")
  /// ````
  NotificationDto call({
    Object? id = const $CopyWithPlaceholder(),
    Object? template = const $CopyWithPlaceholder(),
    Object? title = const $CopyWithPlaceholder(),
    Object? body = const $CopyWithPlaceholder(),
    Object? requestId = const $CopyWithPlaceholder(),
    Object? readAt = const $CopyWithPlaceholder(),
    Object? createdAt = const $CopyWithPlaceholder(),
  }) {
    return NotificationDto(
      id: id == const $CopyWithPlaceholder()
          ? _value.id
          // ignore: cast_nullable_to_non_nullable
          : id as String,
      template: template == const $CopyWithPlaceholder()
          ? _value.template
          // ignore: cast_nullable_to_non_nullable
          : template as String,
      title: title == const $CopyWithPlaceholder()
          ? _value.title
          // ignore: cast_nullable_to_non_nullable
          : title as String,
      body: body == const $CopyWithPlaceholder()
          ? _value.body
          // ignore: cast_nullable_to_non_nullable
          : body as String,
      requestId: requestId == const $CopyWithPlaceholder()
          ? _value.requestId
          // ignore: cast_nullable_to_non_nullable
          : requestId as String?,
      readAt: readAt == const $CopyWithPlaceholder()
          ? _value.readAt
          // ignore: cast_nullable_to_non_nullable
          : readAt as DateTime?,
      createdAt: createdAt == const $CopyWithPlaceholder()
          ? _value.createdAt
          // ignore: cast_nullable_to_non_nullable
          : createdAt as DateTime,
    );
  }
}

extension $NotificationDtoCopyWith on NotificationDto {
  /// Returns a callable class that can be used as follows: `instanceOfNotificationDto.copyWith(...)` or like so:`instanceOfNotificationDto.copyWith.fieldName(...)`.
  // ignore: library_private_types_in_public_api
  _$NotificationDtoCWProxy get copyWith => _$NotificationDtoCWProxyImpl(this);
}

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

NotificationDto _$NotificationDtoFromJson(Map<String, dynamic> json) =>
    $checkedCreate('NotificationDto', json, ($checkedConvert) {
      $checkKeys(
        json,
        requiredKeys: const ['id', 'template', 'title', 'body', 'createdAt'],
      );
      final val = NotificationDto(
        id: $checkedConvert('id', (v) => v as String),
        template: $checkedConvert('template', (v) => v as String),
        title: $checkedConvert('title', (v) => v as String),
        body: $checkedConvert('body', (v) => v as String),
        requestId: $checkedConvert('requestId', (v) => v as String?),
        readAt: $checkedConvert(
          'readAt',
          (v) => v == null ? null : DateTime.parse(v as String),
        ),
        createdAt: $checkedConvert(
          'createdAt',
          (v) => DateTime.parse(v as String),
        ),
      );
      return val;
    });

Map<String, dynamic> _$NotificationDtoToJson(NotificationDto instance) =>
    <String, dynamic>{
      'id': instance.id,
      'template': instance.template,
      'title': instance.title,
      'body': instance.body,
      'requestId': ?instance.requestId,
      'readAt': ?instance.readAt?.toIso8601String(),
      'createdAt': instance.createdAt.toIso8601String(),
    };
