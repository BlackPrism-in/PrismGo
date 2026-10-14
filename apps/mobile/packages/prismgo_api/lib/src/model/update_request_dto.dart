//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:prismgo_api/src/model/location_dto.dart';
import 'package:copy_with_extension/copy_with_extension.dart';
import 'package:json_annotation/json_annotation.dart';

part 'update_request_dto.g.dart';

@CopyWith()
@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class UpdateRequestDto {
  /// Returns a new [UpdateRequestDto] instance.
  UpdateRequestDto({
    this.pickup,

    this.drop,

    this.startAt,

    this.returnAt,

    this.passengers,

    this.purpose,

    this.notes,
  });

  @JsonKey(name: r'pickup', required: false, includeIfNull: false)
  final LocationDto? pickup;

  @JsonKey(name: r'drop', required: false, includeIfNull: false)
  final LocationDto? drop;

  @JsonKey(name: r'startAt', required: false, includeIfNull: false)
  final DateTime? startAt;

  /// Return trip time, if any
  @JsonKey(name: r'returnAt', required: false, includeIfNull: false)
  final DateTime? returnAt;

  @JsonKey(name: r'passengers', required: false, includeIfNull: false)
  final num? passengers;

  @JsonKey(name: r'purpose', required: false, includeIfNull: false)
  final String? purpose;

  @JsonKey(name: r'notes', required: false, includeIfNull: false)
  final String? notes;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is UpdateRequestDto &&
          other.pickup == pickup &&
          other.drop == drop &&
          other.startAt == startAt &&
          other.returnAt == returnAt &&
          other.passengers == passengers &&
          other.purpose == purpose &&
          other.notes == notes;

  @override
  int get hashCode =>
      pickup.hashCode +
      drop.hashCode +
      startAt.hashCode +
      (returnAt == null ? 0 : returnAt.hashCode) +
      passengers.hashCode +
      purpose.hashCode +
      (notes == null ? 0 : notes.hashCode);

  factory UpdateRequestDto.fromJson(Map<String, dynamic> json) =>
      _$UpdateRequestDtoFromJson(json);

  Map<String, dynamic> toJson() => _$UpdateRequestDtoToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }
}
