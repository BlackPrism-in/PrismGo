// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'location_dto.dart';

// **************************************************************************
// CopyWithGenerator
// **************************************************************************

abstract class _$LocationDtoCWProxy {
  LocationDto address(String address);

  LocationDto lat(num lat);

  LocationDto lng(num lng);

  /// This function **does support** nullification of nullable fields. All `null` values passed to `non-nullable` fields will be ignored. You can also use `LocationDto(...).copyWith.fieldName(...)` to override fields one at a time with nullification support.
  ///
  /// Usage
  /// ```dart
  /// LocationDto(...).copyWith(id: 12, name: "My name")
  /// ````
  LocationDto call({String address, num lat, num lng});
}

/// Proxy class for `copyWith` functionality. This is a callable class and can be used as follows: `instanceOfLocationDto.copyWith(...)`. Additionally contains functions for specific fields e.g. `instanceOfLocationDto.copyWith.fieldName(...)`
class _$LocationDtoCWProxyImpl implements _$LocationDtoCWProxy {
  const _$LocationDtoCWProxyImpl(this._value);

  final LocationDto _value;

  @override
  LocationDto address(String address) => this(address: address);

  @override
  LocationDto lat(num lat) => this(lat: lat);

  @override
  LocationDto lng(num lng) => this(lng: lng);

  @override
  /// This function **does support** nullification of nullable fields. All `null` values passed to `non-nullable` fields will be ignored. You can also use `LocationDto(...).copyWith.fieldName(...)` to override fields one at a time with nullification support.
  ///
  /// Usage
  /// ```dart
  /// LocationDto(...).copyWith(id: 12, name: "My name")
  /// ````
  LocationDto call({
    Object? address = const $CopyWithPlaceholder(),
    Object? lat = const $CopyWithPlaceholder(),
    Object? lng = const $CopyWithPlaceholder(),
  }) {
    return LocationDto(
      address: address == const $CopyWithPlaceholder()
          ? _value.address
          // ignore: cast_nullable_to_non_nullable
          : address as String,
      lat: lat == const $CopyWithPlaceholder()
          ? _value.lat
          // ignore: cast_nullable_to_non_nullable
          : lat as num,
      lng: lng == const $CopyWithPlaceholder()
          ? _value.lng
          // ignore: cast_nullable_to_non_nullable
          : lng as num,
    );
  }
}

extension $LocationDtoCopyWith on LocationDto {
  /// Returns a callable class that can be used as follows: `instanceOfLocationDto.copyWith(...)` or like so:`instanceOfLocationDto.copyWith.fieldName(...)`.
  // ignore: library_private_types_in_public_api
  _$LocationDtoCWProxy get copyWith => _$LocationDtoCWProxyImpl(this);
}

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

LocationDto _$LocationDtoFromJson(Map<String, dynamic> json) =>
    $checkedCreate('LocationDto', json, ($checkedConvert) {
      $checkKeys(json, requiredKeys: const ['address', 'lat', 'lng']);
      final val = LocationDto(
        address: $checkedConvert('address', (v) => v as String),
        lat: $checkedConvert('lat', (v) => v as num),
        lng: $checkedConvert('lng', (v) => v as num),
      );
      return val;
    });

Map<String, dynamic> _$LocationDtoToJson(LocationDto instance) =>
    <String, dynamic>{
      'address': instance.address,
      'lat': instance.lat,
      'lng': instance.lng,
    };
