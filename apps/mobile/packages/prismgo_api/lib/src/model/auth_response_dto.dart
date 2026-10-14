//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:prismgo_api/src/model/me_dto.dart';
import 'package:copy_with_extension/copy_with_extension.dart';
import 'package:json_annotation/json_annotation.dart';

part 'auth_response_dto.g.dart';

@CopyWith()
@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class AuthResponseDto {
  /// Returns a new [AuthResponseDto] instance.
  AuthResponseDto({
    required this.accessToken,

    this.refreshToken,

    required this.expiresIn,

    required this.user,
  });

  @JsonKey(name: r'accessToken', required: true, includeIfNull: false)
  final String accessToken;

  /// Omitted for web clients (sent as an httpOnly cookie)
  @JsonKey(name: r'refreshToken', required: false, includeIfNull: false)
  final String? refreshToken;

  /// Access token lifetime in seconds
  @JsonKey(name: r'expiresIn', required: true, includeIfNull: false)
  final num expiresIn;

  @JsonKey(name: r'user', required: true, includeIfNull: false)
  final MeDto user;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is AuthResponseDto &&
          other.accessToken == accessToken &&
          other.refreshToken == refreshToken &&
          other.expiresIn == expiresIn &&
          other.user == user;

  @override
  int get hashCode =>
      accessToken.hashCode +
      refreshToken.hashCode +
      expiresIn.hashCode +
      user.hashCode;

  factory AuthResponseDto.fromJson(Map<String, dynamic> json) =>
      _$AuthResponseDtoFromJson(json);

  Map<String, dynamic> toJson() => _$AuthResponseDtoToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }
}
