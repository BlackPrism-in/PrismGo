// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'reject_dto.dart';

// **************************************************************************
// CopyWithGenerator
// **************************************************************************

abstract class _$RejectDtoCWProxy {
  RejectDto comment(String comment);

  /// This function **does support** nullification of nullable fields. All `null` values passed to `non-nullable` fields will be ignored. You can also use `RejectDto(...).copyWith.fieldName(...)` to override fields one at a time with nullification support.
  ///
  /// Usage
  /// ```dart
  /// RejectDto(...).copyWith(id: 12, name: "My name")
  /// ````
  RejectDto call({String comment});
}

/// Proxy class for `copyWith` functionality. This is a callable class and can be used as follows: `instanceOfRejectDto.copyWith(...)`. Additionally contains functions for specific fields e.g. `instanceOfRejectDto.copyWith.fieldName(...)`
class _$RejectDtoCWProxyImpl implements _$RejectDtoCWProxy {
  const _$RejectDtoCWProxyImpl(this._value);

  final RejectDto _value;

  @override
  RejectDto comment(String comment) => this(comment: comment);

  @override
  /// This function **does support** nullification of nullable fields. All `null` values passed to `non-nullable` fields will be ignored. You can also use `RejectDto(...).copyWith.fieldName(...)` to override fields one at a time with nullification support.
  ///
  /// Usage
  /// ```dart
  /// RejectDto(...).copyWith(id: 12, name: "My name")
  /// ````
  RejectDto call({Object? comment = const $CopyWithPlaceholder()}) {
    return RejectDto(
      comment: comment == const $CopyWithPlaceholder()
          ? _value.comment
          // ignore: cast_nullable_to_non_nullable
          : comment as String,
    );
  }
}

extension $RejectDtoCopyWith on RejectDto {
  /// Returns a callable class that can be used as follows: `instanceOfRejectDto.copyWith(...)` or like so:`instanceOfRejectDto.copyWith.fieldName(...)`.
  // ignore: library_private_types_in_public_api
  _$RejectDtoCWProxy get copyWith => _$RejectDtoCWProxyImpl(this);
}

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

RejectDto _$RejectDtoFromJson(Map<String, dynamic> json) =>
    $checkedCreate('RejectDto', json, ($checkedConvert) {
      $checkKeys(json, requiredKeys: const ['comment']);
      final val = RejectDto(
        comment: $checkedConvert('comment', (v) => v as String),
      );
      return val;
    });

Map<String, dynamic> _$RejectDtoToJson(RejectDto instance) => <String, dynamic>{
  'comment': instance.comment,
};
