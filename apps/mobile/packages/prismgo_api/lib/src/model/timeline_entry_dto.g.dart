// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'timeline_entry_dto.dart';

// **************************************************************************
// CopyWithGenerator
// **************************************************************************

abstract class _$TimelineEntryDtoCWProxy {
  TimelineEntryDto type(TimelineType type);

  TimelineEntryDto at(DateTime at);

  TimelineEntryDto actorName(String? actorName);

  TimelineEntryDto note(String? note);

  /// This function **does support** nullification of nullable fields. All `null` values passed to `non-nullable` fields will be ignored. You can also use `TimelineEntryDto(...).copyWith.fieldName(...)` to override fields one at a time with nullification support.
  ///
  /// Usage
  /// ```dart
  /// TimelineEntryDto(...).copyWith(id: 12, name: "My name")
  /// ````
  TimelineEntryDto call({
    TimelineType type,
    DateTime at,
    String? actorName,
    String? note,
  });
}

/// Proxy class for `copyWith` functionality. This is a callable class and can be used as follows: `instanceOfTimelineEntryDto.copyWith(...)`. Additionally contains functions for specific fields e.g. `instanceOfTimelineEntryDto.copyWith.fieldName(...)`
class _$TimelineEntryDtoCWProxyImpl implements _$TimelineEntryDtoCWProxy {
  const _$TimelineEntryDtoCWProxyImpl(this._value);

  final TimelineEntryDto _value;

  @override
  TimelineEntryDto type(TimelineType type) => this(type: type);

  @override
  TimelineEntryDto at(DateTime at) => this(at: at);

  @override
  TimelineEntryDto actorName(String? actorName) => this(actorName: actorName);

  @override
  TimelineEntryDto note(String? note) => this(note: note);

  @override
  /// This function **does support** nullification of nullable fields. All `null` values passed to `non-nullable` fields will be ignored. You can also use `TimelineEntryDto(...).copyWith.fieldName(...)` to override fields one at a time with nullification support.
  ///
  /// Usage
  /// ```dart
  /// TimelineEntryDto(...).copyWith(id: 12, name: "My name")
  /// ````
  TimelineEntryDto call({
    Object? type = const $CopyWithPlaceholder(),
    Object? at = const $CopyWithPlaceholder(),
    Object? actorName = const $CopyWithPlaceholder(),
    Object? note = const $CopyWithPlaceholder(),
  }) {
    return TimelineEntryDto(
      type: type == const $CopyWithPlaceholder()
          ? _value.type
          // ignore: cast_nullable_to_non_nullable
          : type as TimelineType,
      at: at == const $CopyWithPlaceholder()
          ? _value.at
          // ignore: cast_nullable_to_non_nullable
          : at as DateTime,
      actorName: actorName == const $CopyWithPlaceholder()
          ? _value.actorName
          // ignore: cast_nullable_to_non_nullable
          : actorName as String?,
      note: note == const $CopyWithPlaceholder()
          ? _value.note
          // ignore: cast_nullable_to_non_nullable
          : note as String?,
    );
  }
}

extension $TimelineEntryDtoCopyWith on TimelineEntryDto {
  /// Returns a callable class that can be used as follows: `instanceOfTimelineEntryDto.copyWith(...)` or like so:`instanceOfTimelineEntryDto.copyWith.fieldName(...)`.
  // ignore: library_private_types_in_public_api
  _$TimelineEntryDtoCWProxy get copyWith => _$TimelineEntryDtoCWProxyImpl(this);
}

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

TimelineEntryDto _$TimelineEntryDtoFromJson(Map<String, dynamic> json) =>
    $checkedCreate('TimelineEntryDto', json, ($checkedConvert) {
      $checkKeys(json, requiredKeys: const ['type', 'at']);
      final val = TimelineEntryDto(
        type: $checkedConvert(
          'type',
          (v) => $enumDecode(_$TimelineTypeEnumMap, v),
        ),
        at: $checkedConvert('at', (v) => DateTime.parse(v as String)),
        actorName: $checkedConvert('actorName', (v) => v as String?),
        note: $checkedConvert('note', (v) => v as String?),
      );
      return val;
    });

Map<String, dynamic> _$TimelineEntryDtoToJson(TimelineEntryDto instance) =>
    <String, dynamic>{
      'type': _$TimelineTypeEnumMap[instance.type]!,
      'at': instance.at.toIso8601String(),
      'actorName': ?instance.actorName,
      'note': ?instance.note,
    };

const _$TimelineTypeEnumMap = {
  TimelineType.created: 'created',
  TimelineType.submitted: 'submitted',
  TimelineType.autoApproved: 'auto_approved',
  TimelineType.approved: 'approved',
  TimelineType.rejected: 'rejected',
  TimelineType.assigned: 'assigned',
  TimelineType.reassigned: 'reassigned',
  TimelineType.started: 'started',
  TimelineType.pickedUp: 'picked_up',
  TimelineType.dropped: 'dropped',
  TimelineType.ended: 'ended',
  TimelineType.gpsLost: 'gps_lost',
  TimelineType.cancelled: 'cancelled',
};
