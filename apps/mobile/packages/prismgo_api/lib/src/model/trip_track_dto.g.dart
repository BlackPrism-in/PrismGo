// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'trip_track_dto.dart';

// **************************************************************************
// CopyWithGenerator
// **************************************************************************

abstract class _$TripTrackDtoCWProxy {
  TripTrackDto tripId(String tripId);

  TripTrackDto requestId(String requestId);

  TripTrackDto status(TripStatus status);

  TripTrackDto vehicleRegNo(String vehicleRegNo);

  TripTrackDto pickup(TrackPointDto pickup);

  TripTrackDto drop(TrackPointDto drop);

  TripTrackDto points(List<TrackPointDto> points);

  TripTrackDto position(PositionDto? position);

  TripTrackDto etaMinutes(num? etaMinutes);

  TripTrackDto etaTo(EtaTarget etaTo);

  /// This function **does support** nullification of nullable fields. All `null` values passed to `non-nullable` fields will be ignored. You can also use `TripTrackDto(...).copyWith.fieldName(...)` to override fields one at a time with nullification support.
  ///
  /// Usage
  /// ```dart
  /// TripTrackDto(...).copyWith(id: 12, name: "My name")
  /// ````
  TripTrackDto call({
    String tripId,
    String requestId,
    TripStatus status,
    String vehicleRegNo,
    TrackPointDto pickup,
    TrackPointDto drop,
    List<TrackPointDto> points,
    PositionDto? position,
    num? etaMinutes,
    EtaTarget etaTo,
  });
}

/// Proxy class for `copyWith` functionality. This is a callable class and can be used as follows: `instanceOfTripTrackDto.copyWith(...)`. Additionally contains functions for specific fields e.g. `instanceOfTripTrackDto.copyWith.fieldName(...)`
class _$TripTrackDtoCWProxyImpl implements _$TripTrackDtoCWProxy {
  const _$TripTrackDtoCWProxyImpl(this._value);

  final TripTrackDto _value;

  @override
  TripTrackDto tripId(String tripId) => this(tripId: tripId);

  @override
  TripTrackDto requestId(String requestId) => this(requestId: requestId);

  @override
  TripTrackDto status(TripStatus status) => this(status: status);

  @override
  TripTrackDto vehicleRegNo(String vehicleRegNo) =>
      this(vehicleRegNo: vehicleRegNo);

  @override
  TripTrackDto pickup(TrackPointDto pickup) => this(pickup: pickup);

  @override
  TripTrackDto drop(TrackPointDto drop) => this(drop: drop);

  @override
  TripTrackDto points(List<TrackPointDto> points) => this(points: points);

  @override
  TripTrackDto position(PositionDto? position) => this(position: position);

  @override
  TripTrackDto etaMinutes(num? etaMinutes) => this(etaMinutes: etaMinutes);

  @override
  TripTrackDto etaTo(EtaTarget etaTo) => this(etaTo: etaTo);

  @override
  /// This function **does support** nullification of nullable fields. All `null` values passed to `non-nullable` fields will be ignored. You can also use `TripTrackDto(...).copyWith.fieldName(...)` to override fields one at a time with nullification support.
  ///
  /// Usage
  /// ```dart
  /// TripTrackDto(...).copyWith(id: 12, name: "My name")
  /// ````
  TripTrackDto call({
    Object? tripId = const $CopyWithPlaceholder(),
    Object? requestId = const $CopyWithPlaceholder(),
    Object? status = const $CopyWithPlaceholder(),
    Object? vehicleRegNo = const $CopyWithPlaceholder(),
    Object? pickup = const $CopyWithPlaceholder(),
    Object? drop = const $CopyWithPlaceholder(),
    Object? points = const $CopyWithPlaceholder(),
    Object? position = const $CopyWithPlaceholder(),
    Object? etaMinutes = const $CopyWithPlaceholder(),
    Object? etaTo = const $CopyWithPlaceholder(),
  }) {
    return TripTrackDto(
      tripId: tripId == const $CopyWithPlaceholder()
          ? _value.tripId
          // ignore: cast_nullable_to_non_nullable
          : tripId as String,
      requestId: requestId == const $CopyWithPlaceholder()
          ? _value.requestId
          // ignore: cast_nullable_to_non_nullable
          : requestId as String,
      status: status == const $CopyWithPlaceholder()
          ? _value.status
          // ignore: cast_nullable_to_non_nullable
          : status as TripStatus,
      vehicleRegNo: vehicleRegNo == const $CopyWithPlaceholder()
          ? _value.vehicleRegNo
          // ignore: cast_nullable_to_non_nullable
          : vehicleRegNo as String,
      pickup: pickup == const $CopyWithPlaceholder()
          ? _value.pickup
          // ignore: cast_nullable_to_non_nullable
          : pickup as TrackPointDto,
      drop: drop == const $CopyWithPlaceholder()
          ? _value.drop
          // ignore: cast_nullable_to_non_nullable
          : drop as TrackPointDto,
      points: points == const $CopyWithPlaceholder()
          ? _value.points
          // ignore: cast_nullable_to_non_nullable
          : points as List<TrackPointDto>,
      position: position == const $CopyWithPlaceholder()
          ? _value.position
          // ignore: cast_nullable_to_non_nullable
          : position as PositionDto?,
      etaMinutes: etaMinutes == const $CopyWithPlaceholder()
          ? _value.etaMinutes
          // ignore: cast_nullable_to_non_nullable
          : etaMinutes as num?,
      etaTo: etaTo == const $CopyWithPlaceholder()
          ? _value.etaTo
          // ignore: cast_nullable_to_non_nullable
          : etaTo as EtaTarget,
    );
  }
}

extension $TripTrackDtoCopyWith on TripTrackDto {
  /// Returns a callable class that can be used as follows: `instanceOfTripTrackDto.copyWith(...)` or like so:`instanceOfTripTrackDto.copyWith.fieldName(...)`.
  // ignore: library_private_types_in_public_api
  _$TripTrackDtoCWProxy get copyWith => _$TripTrackDtoCWProxyImpl(this);
}

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

TripTrackDto _$TripTrackDtoFromJson(
  Map<String, dynamic> json,
) => $checkedCreate('TripTrackDto', json, ($checkedConvert) {
  $checkKeys(
    json,
    requiredKeys: const [
      'tripId',
      'requestId',
      'status',
      'vehicleRegNo',
      'pickup',
      'drop',
      'points',
      'etaTo',
    ],
  );
  final val = TripTrackDto(
    tripId: $checkedConvert('tripId', (v) => v as String),
    requestId: $checkedConvert('requestId', (v) => v as String),
    status: $checkedConvert(
      'status',
      (v) => $enumDecode(_$TripStatusEnumMap, v),
    ),
    vehicleRegNo: $checkedConvert('vehicleRegNo', (v) => v as String),
    pickup: $checkedConvert(
      'pickup',
      (v) => TrackPointDto.fromJson(v as Map<String, dynamic>),
    ),
    drop: $checkedConvert(
      'drop',
      (v) => TrackPointDto.fromJson(v as Map<String, dynamic>),
    ),
    points: $checkedConvert(
      'points',
      (v) => (v as List<dynamic>)
          .map((e) => TrackPointDto.fromJson(e as Map<String, dynamic>))
          .toList(),
    ),
    position: $checkedConvert(
      'position',
      (v) => v == null ? null : PositionDto.fromJson(v as Map<String, dynamic>),
    ),
    etaMinutes: $checkedConvert('etaMinutes', (v) => v as num?),
    etaTo: $checkedConvert('etaTo', (v) => $enumDecode(_$EtaTargetEnumMap, v)),
  );
  return val;
});

Map<String, dynamic> _$TripTrackDtoToJson(TripTrackDto instance) =>
    <String, dynamic>{
      'tripId': instance.tripId,
      'requestId': instance.requestId,
      'status': _$TripStatusEnumMap[instance.status]!,
      'vehicleRegNo': instance.vehicleRegNo,
      'pickup': instance.pickup.toJson(),
      'drop': instance.drop.toJson(),
      'points': instance.points.map((e) => e.toJson()).toList(),
      'position': ?instance.position?.toJson(),
      'etaMinutes': ?instance.etaMinutes,
      'etaTo': _$EtaTargetEnumMap[instance.etaTo]!,
    };

const _$TripStatusEnumMap = {
  TripStatus.scheduled: 'scheduled',
  TripStatus.inProgress: 'in_progress',
  TripStatus.completed: 'completed',
  TripStatus.cancelled: 'cancelled',
};

const _$EtaTargetEnumMap = {EtaTarget.pickup: 'pickup', EtaTarget.drop: 'drop'};
