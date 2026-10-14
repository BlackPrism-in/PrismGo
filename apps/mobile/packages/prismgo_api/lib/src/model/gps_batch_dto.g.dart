// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'gps_batch_dto.dart';

// **************************************************************************
// CopyWithGenerator
// **************************************************************************

abstract class _$GpsBatchDtoCWProxy {
  GpsBatchDto points(List<GpsPointDto> points);

  /// This function **does support** nullification of nullable fields. All `null` values passed to `non-nullable` fields will be ignored. You can also use `GpsBatchDto(...).copyWith.fieldName(...)` to override fields one at a time with nullification support.
  ///
  /// Usage
  /// ```dart
  /// GpsBatchDto(...).copyWith(id: 12, name: "My name")
  /// ````
  GpsBatchDto call({List<GpsPointDto> points});
}

/// Proxy class for `copyWith` functionality. This is a callable class and can be used as follows: `instanceOfGpsBatchDto.copyWith(...)`. Additionally contains functions for specific fields e.g. `instanceOfGpsBatchDto.copyWith.fieldName(...)`
class _$GpsBatchDtoCWProxyImpl implements _$GpsBatchDtoCWProxy {
  const _$GpsBatchDtoCWProxyImpl(this._value);

  final GpsBatchDto _value;

  @override
  GpsBatchDto points(List<GpsPointDto> points) => this(points: points);

  @override
  /// This function **does support** nullification of nullable fields. All `null` values passed to `non-nullable` fields will be ignored. You can also use `GpsBatchDto(...).copyWith.fieldName(...)` to override fields one at a time with nullification support.
  ///
  /// Usage
  /// ```dart
  /// GpsBatchDto(...).copyWith(id: 12, name: "My name")
  /// ````
  GpsBatchDto call({Object? points = const $CopyWithPlaceholder()}) {
    return GpsBatchDto(
      points: points == const $CopyWithPlaceholder()
          ? _value.points
          // ignore: cast_nullable_to_non_nullable
          : points as List<GpsPointDto>,
    );
  }
}

extension $GpsBatchDtoCopyWith on GpsBatchDto {
  /// Returns a callable class that can be used as follows: `instanceOfGpsBatchDto.copyWith(...)` or like so:`instanceOfGpsBatchDto.copyWith.fieldName(...)`.
  // ignore: library_private_types_in_public_api
  _$GpsBatchDtoCWProxy get copyWith => _$GpsBatchDtoCWProxyImpl(this);
}

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GpsBatchDto _$GpsBatchDtoFromJson(Map<String, dynamic> json) =>
    $checkedCreate('GpsBatchDto', json, ($checkedConvert) {
      $checkKeys(json, requiredKeys: const ['points']);
      final val = GpsBatchDto(
        points: $checkedConvert(
          'points',
          (v) => (v as List<dynamic>)
              .map((e) => GpsPointDto.fromJson(e as Map<String, dynamic>))
              .toList(),
        ),
      );
      return val;
    });

Map<String, dynamic> _$GpsBatchDtoToJson(GpsBatchDto instance) =>
    <String, dynamic>{
      'points': instance.points.map((e) => e.toJson()).toList(),
    };
