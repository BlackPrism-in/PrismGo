// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'request_otp_response_dto.dart';

// **************************************************************************
// CopyWithGenerator
// **************************************************************************

abstract class _$RequestOtpResponseDtoCWProxy {
  RequestOtpResponseDto sent(bool sent);

  RequestOtpResponseDto devCode(String? devCode);

  /// This function **does support** nullification of nullable fields. All `null` values passed to `non-nullable` fields will be ignored. You can also use `RequestOtpResponseDto(...).copyWith.fieldName(...)` to override fields one at a time with nullification support.
  ///
  /// Usage
  /// ```dart
  /// RequestOtpResponseDto(...).copyWith(id: 12, name: "My name")
  /// ````
  RequestOtpResponseDto call({bool sent, String? devCode});
}

/// Proxy class for `copyWith` functionality. This is a callable class and can be used as follows: `instanceOfRequestOtpResponseDto.copyWith(...)`. Additionally contains functions for specific fields e.g. `instanceOfRequestOtpResponseDto.copyWith.fieldName(...)`
class _$RequestOtpResponseDtoCWProxyImpl
    implements _$RequestOtpResponseDtoCWProxy {
  const _$RequestOtpResponseDtoCWProxyImpl(this._value);

  final RequestOtpResponseDto _value;

  @override
  RequestOtpResponseDto sent(bool sent) => this(sent: sent);

  @override
  RequestOtpResponseDto devCode(String? devCode) => this(devCode: devCode);

  @override
  /// This function **does support** nullification of nullable fields. All `null` values passed to `non-nullable` fields will be ignored. You can also use `RequestOtpResponseDto(...).copyWith.fieldName(...)` to override fields one at a time with nullification support.
  ///
  /// Usage
  /// ```dart
  /// RequestOtpResponseDto(...).copyWith(id: 12, name: "My name")
  /// ````
  RequestOtpResponseDto call({
    Object? sent = const $CopyWithPlaceholder(),
    Object? devCode = const $CopyWithPlaceholder(),
  }) {
    return RequestOtpResponseDto(
      sent: sent == const $CopyWithPlaceholder()
          ? _value.sent
          // ignore: cast_nullable_to_non_nullable
          : sent as bool,
      devCode: devCode == const $CopyWithPlaceholder()
          ? _value.devCode
          // ignore: cast_nullable_to_non_nullable
          : devCode as String?,
    );
  }
}

extension $RequestOtpResponseDtoCopyWith on RequestOtpResponseDto {
  /// Returns a callable class that can be used as follows: `instanceOfRequestOtpResponseDto.copyWith(...)` or like so:`instanceOfRequestOtpResponseDto.copyWith.fieldName(...)`.
  // ignore: library_private_types_in_public_api
  _$RequestOtpResponseDtoCWProxy get copyWith =>
      _$RequestOtpResponseDtoCWProxyImpl(this);
}

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

RequestOtpResponseDto _$RequestOtpResponseDtoFromJson(
  Map<String, dynamic> json,
) => $checkedCreate('RequestOtpResponseDto', json, ($checkedConvert) {
  $checkKeys(json, requiredKeys: const ['sent']);
  final val = RequestOtpResponseDto(
    sent: $checkedConvert('sent', (v) => v as bool),
    devCode: $checkedConvert('devCode', (v) => v as String?),
  );
  return val;
});

Map<String, dynamic> _$RequestOtpResponseDtoToJson(
  RequestOtpResponseDto instance,
) => <String, dynamic>{'sent': instance.sent, 'devCode': ?instance.devCode};
