//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:copy_with_extension/copy_with_extension.dart';
import 'package:json_annotation/json_annotation.dart';

part 'request_otp_response_dto.g.dart';

@CopyWith()
@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class RequestOtpResponseDto {
  /// Returns a new [RequestOtpResponseDto] instance.
  RequestOtpResponseDto({required this.sent, this.devCode});

  @JsonKey(name: r'sent', required: true, includeIfNull: false)
  final bool sent;

  /// Only in development with the console sender
  @JsonKey(name: r'devCode', required: false, includeIfNull: false)
  final String? devCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is RequestOtpResponseDto &&
          other.sent == sent &&
          other.devCode == devCode;

  @override
  int get hashCode => sent.hashCode + devCode.hashCode;

  factory RequestOtpResponseDto.fromJson(Map<String, dynamic> json) =>
      _$RequestOtpResponseDtoFromJson(json);

  Map<String, dynamic> toJson() => _$RequestOtpResponseDtoToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }
}
