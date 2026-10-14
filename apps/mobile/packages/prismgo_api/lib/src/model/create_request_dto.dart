//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:prismgo_api/src/model/location_dto.dart';
import 'package:copy_with_extension/copy_with_extension.dart';
import 'package:json_annotation/json_annotation.dart';

part 'create_request_dto.g.dart';

@CopyWith()
@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class CreateRequestDto {
  /// Returns a new [CreateRequestDto] instance.
  CreateRequestDto({
    required this.pickup,

    required this.drop,

    required this.startAt,

    this.returnAt,

    required this.passengers,

    required this.purpose,

    this.notes,

    this.submit,
  });

  @JsonKey(name: r'pickup', required: true, includeIfNull: false)
  final LocationDto pickup;

  @JsonKey(name: r'drop', required: true, includeIfNull: false)
  final LocationDto drop;

  @JsonKey(name: r'startAt', required: true, includeIfNull: false)
  final DateTime startAt;

  /// Return trip time, if any
  @JsonKey(name: r'returnAt', required: false, includeIfNull: false)
  final DateTime? returnAt;

  @JsonKey(name: r'passengers', required: true, includeIfNull: false)
  final num passengers;

  @JsonKey(name: r'purpose', required: true, includeIfNull: false)
  final String purpose;

  @JsonKey(name: r'notes', required: false, includeIfNull: false)
  final String? notes;

  /// Defaults to true; false saves a draft
  @JsonKey(name: r'submit', required: false, includeIfNull: false)
  final bool? submit;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is CreateRequestDto &&
          other.pickup == pickup &&
          other.drop == drop &&
          other.startAt == startAt &&
          other.returnAt == returnAt &&
          other.passengers == passengers &&
          other.purpose == purpose &&
          other.notes == notes &&
          other.submit == submit;

  @override
  int get hashCode =>
      pickup.hashCode +
      drop.hashCode +
      startAt.hashCode +
      (returnAt == null ? 0 : returnAt.hashCode) +
      passengers.hashCode +
      purpose.hashCode +
      (notes == null ? 0 : notes.hashCode) +
      submit.hashCode;

  factory CreateRequestDto.fromJson(Map<String, dynamic> json) =>
      _$CreateRequestDtoFromJson(json);

  Map<String, dynamic> toJson() => _$CreateRequestDtoToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }
}
