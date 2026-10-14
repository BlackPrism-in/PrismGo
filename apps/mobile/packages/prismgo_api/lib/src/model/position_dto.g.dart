// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'position_dto.dart';

// **************************************************************************
// CopyWithGenerator
// **************************************************************************

abstract class _$PositionDtoCWProxy {
  PositionDto lat(num lat);

  PositionDto lng(num lng);

  PositionDto speedKmh(num? speedKmh);

  PositionDto heading(num? heading);

  PositionDto recordedAt(DateTime recordedAt);

  /// This function **does support** nullification of nullable fields. All `null` values passed to `non-nullable` fields will be ignored. You can also use `PositionDto(...).copyWith.fieldName(...)` to override fields one at a time with nullification support.
  ///
  /// Usage
  /// ```dart
  /// PositionDto(...).copyWith(id: 12, name: "My name")
  /// ````
  PositionDto call({
    num lat,
    num lng,
    num? speedKmh,
    num? heading,
    DateTime recordedAt,
  });
}

/// Proxy class for `copyWith` functionality. This is a callable class and can be used as follows: `instanceOfPositionDto.copyWith(...)`. Additionally contains functions for specific fields e.g. `instanceOfPositionDto.copyWith.fieldName(...)`
class _$PositionDtoCWProxyImpl implements _$PositionDtoCWProxy {
  const _$PositionDtoCWProxyImpl(this._value);

  final PositionDto _value;

  @override
  PositionDto lat(num lat) => this(lat: lat);

  @override
  PositionDto lng(num lng) => this(lng: lng);

  @override
  PositionDto speedKmh(num? speedKmh) => this(speedKmh: speedKmh);

  @override
  PositionDto heading(num? heading) => this(heading: heading);

  @override
  PositionDto recordedAt(DateTime recordedAt) => this(recordedAt: recordedAt);

  @override
  /// This function **does support** nullification of nullable fields. All `null` values passed to `non-nullable` fields will be ignored. You can also use `PositionDto(...).copyWith.fieldName(...)` to override fields one at a time with nullification support.
  ///
  /// Usage
  /// ```dart
  /// PositionDto(...).copyWith(id: 12, name: "My name")
  /// ````
  PositionDto call({
    Object? lat = const $CopyWithPlaceholder(),
    Object? lng = const $CopyWithPlaceholder(),
    Object? speedKmh = const $CopyWithPlaceholder(),
    Object? heading = const $CopyWithPlaceholder(),
    Object? recordedAt = const $CopyWithPlaceholder(),
  }) {
    return PositionDto(
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
      recordedAt: recordedAt == const $CopyWithPlaceholder()
          ? _value.recordedAt
          // ignore: cast_nullable_to_non_nullable
          : recordedAt as DateTime,
    );
  }
}

extension $PositionDtoCopyWith on PositionDto {
  /// Returns a callable class that can be used as follows: `instanceOfPositionDto.copyWith(...)` or like so:`instanceOfPositionDto.copyWith.fieldName(...)`.
  // ignore: library_private_types_in_public_api
  _$PositionDtoCWProxy get copyWith => _$PositionDtoCWProxyImpl(this);
}

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

PositionDto _$PositionDtoFromJson(Map<String, dynamic> json) =>
    $checkedCreate('PositionDto', json, ($checkedConvert) {
      $checkKeys(json, requiredKeys: const ['lat', 'lng', 'recordedAt']);
      final val = PositionDto(
        lat: $checkedConvert('lat', (v) => v as num),
        lng: $checkedConvert('lng', (v) => v as num),
        speedKmh: $checkedConvert('speedKmh', (v) => v as num?),
        heading: $checkedConvert('heading', (v) => v as num?),
        recordedAt: $checkedConvert(
          'recordedAt',
          (v) => DateTime.parse(v as String),
        ),
      );
      return val;
    });

Map<String, dynamic> _$PositionDtoToJson(PositionDto instance) =>
    <String, dynamic>{
      'lat': instance.lat,
      'lng': instance.lng,
      'speedKmh': ?instance.speedKmh,
      'heading': ?instance.heading,
      'recordedAt': instance.recordedAt.toIso8601String(),
    };
