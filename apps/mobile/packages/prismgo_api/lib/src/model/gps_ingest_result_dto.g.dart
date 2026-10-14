// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'gps_ingest_result_dto.dart';

// **************************************************************************
// CopyWithGenerator
// **************************************************************************

abstract class _$GpsIngestResultDtoCWProxy {
  GpsIngestResultDto accepted(num accepted);

  GpsIngestResultDto duplicates(num duplicates);

  GpsIngestResultDto rejected(num rejected);

  GpsIngestResultDto unknownDevices(List<String> unknownDevices);

  /// This function **does support** nullification of nullable fields. All `null` values passed to `non-nullable` fields will be ignored. You can also use `GpsIngestResultDto(...).copyWith.fieldName(...)` to override fields one at a time with nullification support.
  ///
  /// Usage
  /// ```dart
  /// GpsIngestResultDto(...).copyWith(id: 12, name: "My name")
  /// ````
  GpsIngestResultDto call({
    num accepted,
    num duplicates,
    num rejected,
    List<String> unknownDevices,
  });
}

/// Proxy class for `copyWith` functionality. This is a callable class and can be used as follows: `instanceOfGpsIngestResultDto.copyWith(...)`. Additionally contains functions for specific fields e.g. `instanceOfGpsIngestResultDto.copyWith.fieldName(...)`
class _$GpsIngestResultDtoCWProxyImpl implements _$GpsIngestResultDtoCWProxy {
  const _$GpsIngestResultDtoCWProxyImpl(this._value);

  final GpsIngestResultDto _value;

  @override
  GpsIngestResultDto accepted(num accepted) => this(accepted: accepted);

  @override
  GpsIngestResultDto duplicates(num duplicates) => this(duplicates: duplicates);

  @override
  GpsIngestResultDto rejected(num rejected) => this(rejected: rejected);

  @override
  GpsIngestResultDto unknownDevices(List<String> unknownDevices) =>
      this(unknownDevices: unknownDevices);

  @override
  /// This function **does support** nullification of nullable fields. All `null` values passed to `non-nullable` fields will be ignored. You can also use `GpsIngestResultDto(...).copyWith.fieldName(...)` to override fields one at a time with nullification support.
  ///
  /// Usage
  /// ```dart
  /// GpsIngestResultDto(...).copyWith(id: 12, name: "My name")
  /// ````
  GpsIngestResultDto call({
    Object? accepted = const $CopyWithPlaceholder(),
    Object? duplicates = const $CopyWithPlaceholder(),
    Object? rejected = const $CopyWithPlaceholder(),
    Object? unknownDevices = const $CopyWithPlaceholder(),
  }) {
    return GpsIngestResultDto(
      accepted: accepted == const $CopyWithPlaceholder()
          ? _value.accepted
          // ignore: cast_nullable_to_non_nullable
          : accepted as num,
      duplicates: duplicates == const $CopyWithPlaceholder()
          ? _value.duplicates
          // ignore: cast_nullable_to_non_nullable
          : duplicates as num,
      rejected: rejected == const $CopyWithPlaceholder()
          ? _value.rejected
          // ignore: cast_nullable_to_non_nullable
          : rejected as num,
      unknownDevices: unknownDevices == const $CopyWithPlaceholder()
          ? _value.unknownDevices
          // ignore: cast_nullable_to_non_nullable
          : unknownDevices as List<String>,
    );
  }
}

extension $GpsIngestResultDtoCopyWith on GpsIngestResultDto {
  /// Returns a callable class that can be used as follows: `instanceOfGpsIngestResultDto.copyWith(...)` or like so:`instanceOfGpsIngestResultDto.copyWith.fieldName(...)`.
  // ignore: library_private_types_in_public_api
  _$GpsIngestResultDtoCWProxy get copyWith =>
      _$GpsIngestResultDtoCWProxyImpl(this);
}

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GpsIngestResultDto _$GpsIngestResultDtoFromJson(Map<String, dynamic> json) =>
    $checkedCreate('GpsIngestResultDto', json, ($checkedConvert) {
      $checkKeys(
        json,
        requiredKeys: const [
          'accepted',
          'duplicates',
          'rejected',
          'unknownDevices',
        ],
      );
      final val = GpsIngestResultDto(
        accepted: $checkedConvert('accepted', (v) => v as num),
        duplicates: $checkedConvert('duplicates', (v) => v as num),
        rejected: $checkedConvert('rejected', (v) => v as num),
        unknownDevices: $checkedConvert(
          'unknownDevices',
          (v) => (v as List<dynamic>).map((e) => e as String).toList(),
        ),
      );
      return val;
    });

Map<String, dynamic> _$GpsIngestResultDtoToJson(GpsIngestResultDto instance) =>
    <String, dynamic>{
      'accepted': instance.accepted,
      'duplicates': instance.duplicates,
      'rejected': instance.rejected,
      'unknownDevices': instance.unknownDevices,
    };
