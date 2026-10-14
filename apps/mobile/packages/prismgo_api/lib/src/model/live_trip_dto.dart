//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:prismgo_api/src/model/live_trip_status.dart';
import 'package:prismgo_api/src/model/eta_target.dart';
import 'package:copy_with_extension/copy_with_extension.dart';
import 'package:json_annotation/json_annotation.dart';

part 'live_trip_dto.g.dart';

@CopyWith()
@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class LiveTripDto {
  /// Returns a new [LiveTripDto] instance.
  LiveTripDto({
    required this.id,

    required this.requestId,

    required this.code,

    required this.status,

    required this.requesterName,

    required this.pickupAddress,

    required this.dropAddress,

    required this.scheduledStart,

    this.etaMinutes,

    required this.etaTo,
  });

  @JsonKey(name: r'id', required: true, includeIfNull: false)
  final String id;

  @JsonKey(name: r'requestId', required: true, includeIfNull: false)
  final String requestId;

  @JsonKey(name: r'code', required: true, includeIfNull: false)
  final String code;

  @JsonKey(name: r'status', required: true, includeIfNull: false)
  final LiveTripStatus status;

  @JsonKey(name: r'requesterName', required: true, includeIfNull: false)
  final String requesterName;

  @JsonKey(name: r'pickupAddress', required: true, includeIfNull: false)
  final String pickupAddress;

  @JsonKey(name: r'dropAddress', required: true, includeIfNull: false)
  final String dropAddress;

  @JsonKey(name: r'scheduledStart', required: true, includeIfNull: false)
  final DateTime scheduledStart;

  /// Straight-line estimate until Google Directions is configured
  @JsonKey(name: r'etaMinutes', required: false, includeIfNull: false)
  final num? etaMinutes;

  @JsonKey(name: r'etaTo', required: true, includeIfNull: false)
  final EtaTarget etaTo;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is LiveTripDto &&
          other.id == id &&
          other.requestId == requestId &&
          other.code == code &&
          other.status == status &&
          other.requesterName == requesterName &&
          other.pickupAddress == pickupAddress &&
          other.dropAddress == dropAddress &&
          other.scheduledStart == scheduledStart &&
          other.etaMinutes == etaMinutes &&
          other.etaTo == etaTo;

  @override
  int get hashCode =>
      id.hashCode +
      requestId.hashCode +
      code.hashCode +
      status.hashCode +
      requesterName.hashCode +
      pickupAddress.hashCode +
      dropAddress.hashCode +
      scheduledStart.hashCode +
      (etaMinutes == null ? 0 : etaMinutes.hashCode) +
      etaTo.hashCode;

  factory LiveTripDto.fromJson(Map<String, dynamic> json) =>
      _$LiveTripDtoFromJson(json);

  Map<String, dynamic> toJson() => _$LiveTripDtoToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }
}
