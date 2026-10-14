// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'live_vehicle_dto.dart';

// **************************************************************************
// CopyWithGenerator
// **************************************************************************

abstract class _$LiveVehicleDtoCWProxy {
  LiveVehicleDto id(String id);

  LiveVehicleDto regNo(String regNo);

  LiveVehicleDto type(String type);

  LiveVehicleDto status(VehicleStatus status);

  LiveVehicleDto gpsDeviceId(String? gpsDeviceId);

  LiveVehicleDto position(PositionDto? position);

  LiveVehicleDto stale(bool stale);

  LiveVehicleDto trip(LiveTripDto? trip);

  /// This function **does support** nullification of nullable fields. All `null` values passed to `non-nullable` fields will be ignored. You can also use `LiveVehicleDto(...).copyWith.fieldName(...)` to override fields one at a time with nullification support.
  ///
  /// Usage
  /// ```dart
  /// LiveVehicleDto(...).copyWith(id: 12, name: "My name")
  /// ````
  LiveVehicleDto call({
    String id,
    String regNo,
    String type,
    VehicleStatus status,
    String? gpsDeviceId,
    PositionDto? position,
    bool stale,
    LiveTripDto? trip,
  });
}

/// Proxy class for `copyWith` functionality. This is a callable class and can be used as follows: `instanceOfLiveVehicleDto.copyWith(...)`. Additionally contains functions for specific fields e.g. `instanceOfLiveVehicleDto.copyWith.fieldName(...)`
class _$LiveVehicleDtoCWProxyImpl implements _$LiveVehicleDtoCWProxy {
  const _$LiveVehicleDtoCWProxyImpl(this._value);

  final LiveVehicleDto _value;

  @override
  LiveVehicleDto id(String id) => this(id: id);

  @override
  LiveVehicleDto regNo(String regNo) => this(regNo: regNo);

  @override
  LiveVehicleDto type(String type) => this(type: type);

  @override
  LiveVehicleDto status(VehicleStatus status) => this(status: status);

  @override
  LiveVehicleDto gpsDeviceId(String? gpsDeviceId) =>
      this(gpsDeviceId: gpsDeviceId);

  @override
  LiveVehicleDto position(PositionDto? position) => this(position: position);

  @override
  LiveVehicleDto stale(bool stale) => this(stale: stale);

  @override
  LiveVehicleDto trip(LiveTripDto? trip) => this(trip: trip);

  @override
  /// This function **does support** nullification of nullable fields. All `null` values passed to `non-nullable` fields will be ignored. You can also use `LiveVehicleDto(...).copyWith.fieldName(...)` to override fields one at a time with nullification support.
  ///
  /// Usage
  /// ```dart
  /// LiveVehicleDto(...).copyWith(id: 12, name: "My name")
  /// ````
  LiveVehicleDto call({
    Object? id = const $CopyWithPlaceholder(),
    Object? regNo = const $CopyWithPlaceholder(),
    Object? type = const $CopyWithPlaceholder(),
    Object? status = const $CopyWithPlaceholder(),
    Object? gpsDeviceId = const $CopyWithPlaceholder(),
    Object? position = const $CopyWithPlaceholder(),
    Object? stale = const $CopyWithPlaceholder(),
    Object? trip = const $CopyWithPlaceholder(),
  }) {
    return LiveVehicleDto(
      id: id == const $CopyWithPlaceholder()
          ? _value.id
          // ignore: cast_nullable_to_non_nullable
          : id as String,
      regNo: regNo == const $CopyWithPlaceholder()
          ? _value.regNo
          // ignore: cast_nullable_to_non_nullable
          : regNo as String,
      type: type == const $CopyWithPlaceholder()
          ? _value.type
          // ignore: cast_nullable_to_non_nullable
          : type as String,
      status: status == const $CopyWithPlaceholder()
          ? _value.status
          // ignore: cast_nullable_to_non_nullable
          : status as VehicleStatus,
      gpsDeviceId: gpsDeviceId == const $CopyWithPlaceholder()
          ? _value.gpsDeviceId
          // ignore: cast_nullable_to_non_nullable
          : gpsDeviceId as String?,
      position: position == const $CopyWithPlaceholder()
          ? _value.position
          // ignore: cast_nullable_to_non_nullable
          : position as PositionDto?,
      stale: stale == const $CopyWithPlaceholder()
          ? _value.stale
          // ignore: cast_nullable_to_non_nullable
          : stale as bool,
      trip: trip == const $CopyWithPlaceholder()
          ? _value.trip
          // ignore: cast_nullable_to_non_nullable
          : trip as LiveTripDto?,
    );
  }
}

extension $LiveVehicleDtoCopyWith on LiveVehicleDto {
  /// Returns a callable class that can be used as follows: `instanceOfLiveVehicleDto.copyWith(...)` or like so:`instanceOfLiveVehicleDto.copyWith.fieldName(...)`.
  // ignore: library_private_types_in_public_api
  _$LiveVehicleDtoCWProxy get copyWith => _$LiveVehicleDtoCWProxyImpl(this);
}

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

LiveVehicleDto _$LiveVehicleDtoFromJson(
  Map<String, dynamic> json,
) => $checkedCreate('LiveVehicleDto', json, ($checkedConvert) {
  $checkKeys(
    json,
    requiredKeys: const ['id', 'regNo', 'type', 'status', 'stale'],
  );
  final val = LiveVehicleDto(
    id: $checkedConvert('id', (v) => v as String),
    regNo: $checkedConvert('regNo', (v) => v as String),
    type: $checkedConvert('type', (v) => v as String),
    status: $checkedConvert(
      'status',
      (v) => $enumDecode(_$VehicleStatusEnumMap, v),
    ),
    gpsDeviceId: $checkedConvert('gpsDeviceId', (v) => v as String?),
    position: $checkedConvert(
      'position',
      (v) => v == null ? null : PositionDto.fromJson(v as Map<String, dynamic>),
    ),
    stale: $checkedConvert('stale', (v) => v as bool),
    trip: $checkedConvert(
      'trip',
      (v) => v == null ? null : LiveTripDto.fromJson(v as Map<String, dynamic>),
    ),
  );
  return val;
});

Map<String, dynamic> _$LiveVehicleDtoToJson(LiveVehicleDto instance) =>
    <String, dynamic>{
      'id': instance.id,
      'regNo': instance.regNo,
      'type': instance.type,
      'status': _$VehicleStatusEnumMap[instance.status]!,
      'gpsDeviceId': ?instance.gpsDeviceId,
      'position': ?instance.position?.toJson(),
      'stale': instance.stale,
      'trip': ?instance.trip?.toJson(),
    };

const _$VehicleStatusEnumMap = {
  VehicleStatus.available: 'available',
  VehicleStatus.onTrip: 'on_trip',
  VehicleStatus.maintenance: 'maintenance',
  VehicleStatus.inactive: 'inactive',
};
