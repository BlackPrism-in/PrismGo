// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'approve_dto.dart';

// **************************************************************************
// CopyWithGenerator
// **************************************************************************

abstract class _$ApproveDtoCWProxy {
  ApproveDto comment(String? comment);

  /// This function **does support** nullification of nullable fields. All `null` values passed to `non-nullable` fields will be ignored. You can also use `ApproveDto(...).copyWith.fieldName(...)` to override fields one at a time with nullification support.
  ///
  /// Usage
  /// ```dart
  /// ApproveDto(...).copyWith(id: 12, name: "My name")
  /// ````
  ApproveDto call({String? comment});
}

/// Proxy class for `copyWith` functionality. This is a callable class and can be used as follows: `instanceOfApproveDto.copyWith(...)`. Additionally contains functions for specific fields e.g. `instanceOfApproveDto.copyWith.fieldName(...)`
class _$ApproveDtoCWProxyImpl implements _$ApproveDtoCWProxy {
  const _$ApproveDtoCWProxyImpl(this._value);

  final ApproveDto _value;

  @override
  ApproveDto comment(String? comment) => this(comment: comment);

  @override
  /// This function **does support** nullification of nullable fields. All `null` values passed to `non-nullable` fields will be ignored. You can also use `ApproveDto(...).copyWith.fieldName(...)` to override fields one at a time with nullification support.
  ///
  /// Usage
  /// ```dart
  /// ApproveDto(...).copyWith(id: 12, name: "My name")
  /// ````
  ApproveDto call({Object? comment = const $CopyWithPlaceholder()}) {
    return ApproveDto(
      comment: comment == const $CopyWithPlaceholder()
          ? _value.comment
          // ignore: cast_nullable_to_non_nullable
          : comment as String?,
    );
  }
}

extension $ApproveDtoCopyWith on ApproveDto {
  /// Returns a callable class that can be used as follows: `instanceOfApproveDto.copyWith(...)` or like so:`instanceOfApproveDto.copyWith.fieldName(...)`.
  // ignore: library_private_types_in_public_api
  _$ApproveDtoCWProxy get copyWith => _$ApproveDtoCWProxyImpl(this);
}

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ApproveDto _$ApproveDtoFromJson(Map<String, dynamic> json) =>
    $checkedCreate('ApproveDto', json, ($checkedConvert) {
      final val = ApproveDto(
        comment: $checkedConvert('comment', (v) => v as String?),
      );
      return val;
    });

Map<String, dynamic> _$ApproveDtoToJson(ApproveDto instance) =>
    <String, dynamic>{'comment': ?instance.comment};
