// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'auth_response_dto.dart';

// **************************************************************************
// CopyWithGenerator
// **************************************************************************

abstract class _$AuthResponseDtoCWProxy {
  AuthResponseDto accessToken(String accessToken);

  AuthResponseDto refreshToken(String? refreshToken);

  AuthResponseDto expiresIn(num expiresIn);

  AuthResponseDto user(MeDto user);

  /// This function **does support** nullification of nullable fields. All `null` values passed to `non-nullable` fields will be ignored. You can also use `AuthResponseDto(...).copyWith.fieldName(...)` to override fields one at a time with nullification support.
  ///
  /// Usage
  /// ```dart
  /// AuthResponseDto(...).copyWith(id: 12, name: "My name")
  /// ````
  AuthResponseDto call({
    String accessToken,
    String? refreshToken,
    num expiresIn,
    MeDto user,
  });
}

/// Proxy class for `copyWith` functionality. This is a callable class and can be used as follows: `instanceOfAuthResponseDto.copyWith(...)`. Additionally contains functions for specific fields e.g. `instanceOfAuthResponseDto.copyWith.fieldName(...)`
class _$AuthResponseDtoCWProxyImpl implements _$AuthResponseDtoCWProxy {
  const _$AuthResponseDtoCWProxyImpl(this._value);

  final AuthResponseDto _value;

  @override
  AuthResponseDto accessToken(String accessToken) =>
      this(accessToken: accessToken);

  @override
  AuthResponseDto refreshToken(String? refreshToken) =>
      this(refreshToken: refreshToken);

  @override
  AuthResponseDto expiresIn(num expiresIn) => this(expiresIn: expiresIn);

  @override
  AuthResponseDto user(MeDto user) => this(user: user);

  @override
  /// This function **does support** nullification of nullable fields. All `null` values passed to `non-nullable` fields will be ignored. You can also use `AuthResponseDto(...).copyWith.fieldName(...)` to override fields one at a time with nullification support.
  ///
  /// Usage
  /// ```dart
  /// AuthResponseDto(...).copyWith(id: 12, name: "My name")
  /// ````
  AuthResponseDto call({
    Object? accessToken = const $CopyWithPlaceholder(),
    Object? refreshToken = const $CopyWithPlaceholder(),
    Object? expiresIn = const $CopyWithPlaceholder(),
    Object? user = const $CopyWithPlaceholder(),
  }) {
    return AuthResponseDto(
      accessToken: accessToken == const $CopyWithPlaceholder()
          ? _value.accessToken
          // ignore: cast_nullable_to_non_nullable
          : accessToken as String,
      refreshToken: refreshToken == const $CopyWithPlaceholder()
          ? _value.refreshToken
          // ignore: cast_nullable_to_non_nullable
          : refreshToken as String?,
      expiresIn: expiresIn == const $CopyWithPlaceholder()
          ? _value.expiresIn
          // ignore: cast_nullable_to_non_nullable
          : expiresIn as num,
      user: user == const $CopyWithPlaceholder()
          ? _value.user
          // ignore: cast_nullable_to_non_nullable
          : user as MeDto,
    );
  }
}

extension $AuthResponseDtoCopyWith on AuthResponseDto {
  /// Returns a callable class that can be used as follows: `instanceOfAuthResponseDto.copyWith(...)` or like so:`instanceOfAuthResponseDto.copyWith.fieldName(...)`.
  // ignore: library_private_types_in_public_api
  _$AuthResponseDtoCWProxy get copyWith => _$AuthResponseDtoCWProxyImpl(this);
}

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

AuthResponseDto _$AuthResponseDtoFromJson(Map<String, dynamic> json) =>
    $checkedCreate('AuthResponseDto', json, ($checkedConvert) {
      $checkKeys(
        json,
        requiredKeys: const ['accessToken', 'expiresIn', 'user'],
      );
      final val = AuthResponseDto(
        accessToken: $checkedConvert('accessToken', (v) => v as String),
        refreshToken: $checkedConvert('refreshToken', (v) => v as String?),
        expiresIn: $checkedConvert('expiresIn', (v) => v as num),
        user: $checkedConvert(
          'user',
          (v) => MeDto.fromJson(v as Map<String, dynamic>),
        ),
      );
      return val;
    });

Map<String, dynamic> _$AuthResponseDtoToJson(AuthResponseDto instance) =>
    <String, dynamic>{
      'accessToken': instance.accessToken,
      'refreshToken': ?instance.refreshToken,
      'expiresIn': instance.expiresIn,
      'user': instance.user.toJson(),
    };
