// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'conflict_dto.dart';

// **************************************************************************
// CopyWithGenerator
// **************************************************************************

abstract class _$ConflictDtoCWProxy {
  ConflictDto requestCode(String requestCode);

  ConflictDto requestId(String requestId);

  ConflictDto from(DateTime from);

  ConflictDto to(DateTime to);

  /// This function **does support** nullification of nullable fields. All `null` values passed to `non-nullable` fields will be ignored. You can also use `ConflictDto(...).copyWith.fieldName(...)` to override fields one at a time with nullification support.
  ///
  /// Usage
  /// ```dart
  /// ConflictDto(...).copyWith(id: 12, name: "My name")
  /// ````
  ConflictDto call({
    String requestCode,
    String requestId,
    DateTime from,
    DateTime to,
  });
}

/// Proxy class for `copyWith` functionality. This is a callable class and can be used as follows: `instanceOfConflictDto.copyWith(...)`. Additionally contains functions for specific fields e.g. `instanceOfConflictDto.copyWith.fieldName(...)`
class _$ConflictDtoCWProxyImpl implements _$ConflictDtoCWProxy {
  const _$ConflictDtoCWProxyImpl(this._value);

  final ConflictDto _value;

  @override
  ConflictDto requestCode(String requestCode) => this(requestCode: requestCode);

  @override
  ConflictDto requestId(String requestId) => this(requestId: requestId);

  @override
  ConflictDto from(DateTime from) => this(from: from);

  @override
  ConflictDto to(DateTime to) => this(to: to);

  @override
  /// This function **does support** nullification of nullable fields. All `null` values passed to `non-nullable` fields will be ignored. You can also use `ConflictDto(...).copyWith.fieldName(...)` to override fields one at a time with nullification support.
  ///
  /// Usage
  /// ```dart
  /// ConflictDto(...).copyWith(id: 12, name: "My name")
  /// ````
  ConflictDto call({
    Object? requestCode = const $CopyWithPlaceholder(),
    Object? requestId = const $CopyWithPlaceholder(),
    Object? from = const $CopyWithPlaceholder(),
    Object? to = const $CopyWithPlaceholder(),
  }) {
    return ConflictDto(
      requestCode: requestCode == const $CopyWithPlaceholder()
          ? _value.requestCode
          // ignore: cast_nullable_to_non_nullable
          : requestCode as String,
      requestId: requestId == const $CopyWithPlaceholder()
          ? _value.requestId
          // ignore: cast_nullable_to_non_nullable
          : requestId as String,
      from: from == const $CopyWithPlaceholder()
          ? _value.from
          // ignore: cast_nullable_to_non_nullable
          : from as DateTime,
      to: to == const $CopyWithPlaceholder()
          ? _value.to
          // ignore: cast_nullable_to_non_nullable
          : to as DateTime,
    );
  }
}

extension $ConflictDtoCopyWith on ConflictDto {
  /// Returns a callable class that can be used as follows: `instanceOfConflictDto.copyWith(...)` or like so:`instanceOfConflictDto.copyWith.fieldName(...)`.
  // ignore: library_private_types_in_public_api
  _$ConflictDtoCWProxy get copyWith => _$ConflictDtoCWProxyImpl(this);
}

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ConflictDto _$ConflictDtoFromJson(Map<String, dynamic> json) =>
    $checkedCreate('ConflictDto', json, ($checkedConvert) {
      $checkKeys(
        json,
        requiredKeys: const ['requestCode', 'requestId', 'from', 'to'],
      );
      final val = ConflictDto(
        requestCode: $checkedConvert('requestCode', (v) => v as String),
        requestId: $checkedConvert('requestId', (v) => v as String),
        from: $checkedConvert('from', (v) => DateTime.parse(v as String)),
        to: $checkedConvert('to', (v) => DateTime.parse(v as String)),
      );
      return val;
    });

Map<String, dynamic> _$ConflictDtoToJson(ConflictDto instance) =>
    <String, dynamic>{
      'requestCode': instance.requestCode,
      'requestId': instance.requestId,
      'from': instance.from.toIso8601String(),
      'to': instance.to.toIso8601String(),
    };
