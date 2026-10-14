// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'cancel_dto.dart';

// **************************************************************************
// CopyWithGenerator
// **************************************************************************

abstract class _$CancelDtoCWProxy {
  CancelDto reason(String? reason);

  /// This function **does support** nullification of nullable fields. All `null` values passed to `non-nullable` fields will be ignored. You can also use `CancelDto(...).copyWith.fieldName(...)` to override fields one at a time with nullification support.
  ///
  /// Usage
  /// ```dart
  /// CancelDto(...).copyWith(id: 12, name: "My name")
  /// ````
  CancelDto call({String? reason});
}

/// Proxy class for `copyWith` functionality. This is a callable class and can be used as follows: `instanceOfCancelDto.copyWith(...)`. Additionally contains functions for specific fields e.g. `instanceOfCancelDto.copyWith.fieldName(...)`
class _$CancelDtoCWProxyImpl implements _$CancelDtoCWProxy {
  const _$CancelDtoCWProxyImpl(this._value);

  final CancelDto _value;

  @override
  CancelDto reason(String? reason) => this(reason: reason);

  @override
  /// This function **does support** nullification of nullable fields. All `null` values passed to `non-nullable` fields will be ignored. You can also use `CancelDto(...).copyWith.fieldName(...)` to override fields one at a time with nullification support.
  ///
  /// Usage
  /// ```dart
  /// CancelDto(...).copyWith(id: 12, name: "My name")
  /// ````
  CancelDto call({Object? reason = const $CopyWithPlaceholder()}) {
    return CancelDto(
      reason: reason == const $CopyWithPlaceholder()
          ? _value.reason
          // ignore: cast_nullable_to_non_nullable
          : reason as String?,
    );
  }
}

extension $CancelDtoCopyWith on CancelDto {
  /// Returns a callable class that can be used as follows: `instanceOfCancelDto.copyWith(...)` or like so:`instanceOfCancelDto.copyWith.fieldName(...)`.
  // ignore: library_private_types_in_public_api
  _$CancelDtoCWProxy get copyWith => _$CancelDtoCWProxyImpl(this);
}

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

CancelDto _$CancelDtoFromJson(Map<String, dynamic> json) =>
    $checkedCreate('CancelDto', json, ($checkedConvert) {
      final val = CancelDto(
        reason: $checkedConvert('reason', (v) => v as String?),
      );
      return val;
    });

Map<String, dynamic> _$CancelDtoToJson(CancelDto instance) => <String, dynamic>{
  'reason': ?instance.reason,
};
