// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'track_point_dto.dart';

// **************************************************************************
// CopyWithGenerator
// **************************************************************************

abstract class _$TrackPointDtoCWProxy {
  TrackPointDto lat(num lat);

  TrackPointDto lng(num lng);

  TrackPointDto at(DateTime at);

  /// This function **does support** nullification of nullable fields. All `null` values passed to `non-nullable` fields will be ignored. You can also use `TrackPointDto(...).copyWith.fieldName(...)` to override fields one at a time with nullification support.
  ///
  /// Usage
  /// ```dart
  /// TrackPointDto(...).copyWith(id: 12, name: "My name")
  /// ````
  TrackPointDto call({num lat, num lng, DateTime at});
}

/// Proxy class for `copyWith` functionality. This is a callable class and can be used as follows: `instanceOfTrackPointDto.copyWith(...)`. Additionally contains functions for specific fields e.g. `instanceOfTrackPointDto.copyWith.fieldName(...)`
class _$TrackPointDtoCWProxyImpl implements _$TrackPointDtoCWProxy {
  const _$TrackPointDtoCWProxyImpl(this._value);

  final TrackPointDto _value;

  @override
  TrackPointDto lat(num lat) => this(lat: lat);

  @override
  TrackPointDto lng(num lng) => this(lng: lng);

  @override
  TrackPointDto at(DateTime at) => this(at: at);

  @override
  /// This function **does support** nullification of nullable fields. All `null` values passed to `non-nullable` fields will be ignored. You can also use `TrackPointDto(...).copyWith.fieldName(...)` to override fields one at a time with nullification support.
  ///
  /// Usage
  /// ```dart
  /// TrackPointDto(...).copyWith(id: 12, name: "My name")
  /// ````
  TrackPointDto call({
    Object? lat = const $CopyWithPlaceholder(),
    Object? lng = const $CopyWithPlaceholder(),
    Object? at = const $CopyWithPlaceholder(),
  }) {
    return TrackPointDto(
      lat: lat == const $CopyWithPlaceholder()
          ? _value.lat
          // ignore: cast_nullable_to_non_nullable
          : lat as num,
      lng: lng == const $CopyWithPlaceholder()
          ? _value.lng
          // ignore: cast_nullable_to_non_nullable
          : lng as num,
      at: at == const $CopyWithPlaceholder()
          ? _value.at
          // ignore: cast_nullable_to_non_nullable
          : at as DateTime,
    );
  }
}

extension $TrackPointDtoCopyWith on TrackPointDto {
  /// Returns a callable class that can be used as follows: `instanceOfTrackPointDto.copyWith(...)` or like so:`instanceOfTrackPointDto.copyWith.fieldName(...)`.
  // ignore: library_private_types_in_public_api
  _$TrackPointDtoCWProxy get copyWith => _$TrackPointDtoCWProxyImpl(this);
}

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

TrackPointDto _$TrackPointDtoFromJson(Map<String, dynamic> json) =>
    $checkedCreate('TrackPointDto', json, ($checkedConvert) {
      $checkKeys(json, requiredKeys: const ['lat', 'lng', 'at']);
      final val = TrackPointDto(
        lat: $checkedConvert('lat', (v) => v as num),
        lng: $checkedConvert('lng', (v) => v as num),
        at: $checkedConvert('at', (v) => DateTime.parse(v as String)),
      );
      return val;
    });

Map<String, dynamic> _$TrackPointDtoToJson(TrackPointDto instance) =>
    <String, dynamic>{
      'lat': instance.lat,
      'lng': instance.lng,
      'at': instance.at.toIso8601String(),
    };
