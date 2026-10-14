// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'gps_point_dto.dart';

// **************************************************************************
// CopyWithGenerator
// **************************************************************************

abstract class _$GpsPointDtoCWProxy {
  GpsPointDto deviceId(String deviceId);

  GpsPointDto recordedAt(DateTime recordedAt);

  GpsPointDto lat(num lat);

  GpsPointDto lng(num lng);

  GpsPointDto speedKmh(num? speedKmh);

  GpsPointDto heading(num? heading);

  GpsPointDto ignition(bool? ignition);

  GpsPointDto odometerKm(num? odometerKm);

  /// This function **does support** nullification of nullable fields. All `null` values passed to `non-nullable` fields will be ignored. You can also use `GpsPointDto(...).copyWith.fieldName(...)` to override fields one at a time with nullification support.
  ///
  /// Usage
  /// ```dart
  /// GpsPointDto(...).copyWith(id: 12, name: "My name")
  /// ````
  GpsPointDto call({
    String deviceId,
    DateTime recordedAt,
    num lat,
    num lng,
    num? speedKmh,
    num? heading,
    bool? ignition,
    num? odometerKm,
  });
}

/// Proxy class for `copyWith` functionality. This is a callable class and can be used as follows: `instanceOfGpsPointDto.copyWith(...)`. Additionally contains functions for specific fields e.g. `instanceOfGpsPointDto.copyWith.fieldName(...)`
class _$GpsPointDtoCWProxyImpl implements _$GpsPointDtoCWProxy {
  const _$GpsPointDtoCWProxyImpl(this._value);

  final GpsPointDto _value;

  @override
  GpsPointDto deviceId(String deviceId) => this(deviceId: deviceId);

  @override
  GpsPointDto recordedAt(DateTime recordedAt) => this(recordedAt: recordedAt);

  @override
  GpsPointDto lat(num lat) => this(lat: lat);

  @override
  GpsPointDto lng(num lng) => this(lng: lng);

  @override
  GpsPointDto speedKmh(num? speedKmh) => this(speedKmh: speedKmh);

  @override
  GpsPointDto heading(num? heading) => this(heading: heading);

  @override
  GpsPointDto ignition(bool? ignition) => this(ignition: ignition);

  @override
  GpsPointDto odometerKm(num? odometerKm) => this(odometerKm: odometerKm);

  @override
  /// This function **does support** nullification of nullable fields. All `null` values passed to `non-nullable` fields will be ignored. You can also use `GpsPointDto(...).copyWith.fieldName(...)` to override fields one at a time with nullification support.
  ///
  /// Usage
  /// ```dart
  /// GpsPointDto(...).copyWith(id: 12, name: "My name")
  /// ````
  GpsPointDto call({
    Object? deviceId = const $CopyWithPlaceholder(),
    Object? recordedAt = const $CopyWithPlaceholder(),
    Object? lat = const $CopyWithPlaceholder(),
    Object? lng = const $CopyWithPlaceholder(),
    Object? speedKmh = const $CopyWithPlaceholder(),
    Object? heading = const $CopyWithPlaceholder(),
    Object? ignition = const $CopyWithPlaceholder(),
    Object? odometerKm = const $CopyWithPlaceholder(),
  }) {
    return GpsPointDto(
      deviceId: deviceId == const $CopyWithPlaceholder()
          ? _value.deviceId
          // ignore: cast_nullable_to_non_nullable
          : deviceId as String,
      recordedAt: recordedAt == const $CopyWithPlaceholder()
          ? _value.recordedAt
          // ignore: cast_nullable_to_non_nullable
          : recordedAt as DateTime,
      lat: lat == const $CopyWithPlaceholder()
          ? _value.lat
          // ignore: cast_nullable_to_non_nullable
          : lat as num,
      lng: lng == const $CopyWithPlaceholder()
          ? _value.lng
          // ignore: cast_nullable_to_non_nullable
          : lng as num,
      speedKmh: speedKmh == const $CopyWithPlaceholder()
          ? _value.speedKmh
          // ignore: cast_nullable_to_non_nullable
          : speedKmh as num?,
      heading: heading == const $CopyWithPlaceholder()
          ? _value.heading
          // ignore: cast_nullable_to_non_nullable
          : heading as num?,
      ignition: ignition == const $CopyWithPlaceholder()
          ? _value.ignition
          // ignore: cast_nullable_to_non_nullable
          : ignition as bool?,
      odometerKm: odometerKm == const $CopyWithPlaceholder()
          ? _value.odometerKm
          // ignore: cast_nullable_to_non_nullable
          : odometerKm as num?,
    );
  }
}

extension $GpsPointDtoCopyWith on GpsPointDto {
  /// Returns a callable class that can be used as follows: `instanceOfGpsPointDto.copyWith(...)` or like so:`instanceOfGpsPointDto.copyWith.fieldName(...)`.
  // ignore: library_private_types_in_public_api
  _$GpsPointDtoCWProxy get copyWith => _$GpsPointDtoCWProxyImpl(this);
}

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GpsPointDto _$GpsPointDtoFromJson(Map<String, dynamic> json) =>
    $checkedCreate('GpsPointDto', json, ($checkedConvert) {
      $checkKeys(
        json,
        requiredKeys: const ['deviceId', 'recordedAt', 'lat', 'lng'],
      );
      final val = GpsPointDto(
        deviceId: $checkedConvert('deviceId', (v) => v as String),
        recordedAt: $checkedConvert(
          'recordedAt',
          (v) => DateTime.parse(v as String),
        ),
        lat: $checkedConvert('lat', (v) => v as num),
        lng: $checkedConvert('lng', (v) => v as num),
        speedKmh: $checkedConvert('speedKmh', (v) => v as num?),
        heading: $checkedConvert('heading', (v) => v as num?),
        ignition: $checkedConvert('ignition', (v) => v as bool?),
        odometerKm: $checkedConvert('odometerKm', (v) => v as num?),
      );
      return val;
    });

Map<String, dynamic> _$GpsPointDtoToJson(GpsPointDto instance) =>
    <String, dynamic>{
      'deviceId': instance.deviceId,
      'recordedAt': instance.recordedAt.toIso8601String(),
      'lat': instance.lat,
      'lng': instance.lng,
      'speedKmh': ?instance.speedKmh,
      'heading': ?instance.heading,
      'ignition': ?instance.ignition,
      'odometerKm': ?instance.odometerKm,
    };
