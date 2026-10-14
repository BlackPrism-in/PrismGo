// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'trip_summary_dto.dart';

// **************************************************************************
// CopyWithGenerator
// **************************************************************************

abstract class _$TripSummaryDtoCWProxy {
  TripSummaryDto id(String id);

  TripSummaryDto status(TripStatus status);

  TripSummaryDto vehicle(TripVehicleDto vehicle);

  TripSummaryDto driver(PersonDto driver);

  TripSummaryDto scheduledStart(DateTime scheduledStart);

  TripSummaryDto scheduledEnd(DateTime scheduledEnd);

  /// This function **does support** nullification of nullable fields. All `null` values passed to `non-nullable` fields will be ignored. You can also use `TripSummaryDto(...).copyWith.fieldName(...)` to override fields one at a time with nullification support.
  ///
  /// Usage
  /// ```dart
  /// TripSummaryDto(...).copyWith(id: 12, name: "My name")
  /// ````
  TripSummaryDto call({
    String id,
    TripStatus status,
    TripVehicleDto vehicle,
    PersonDto driver,
    DateTime scheduledStart,
    DateTime scheduledEnd,
  });
}

/// Proxy class for `copyWith` functionality. This is a callable class and can be used as follows: `instanceOfTripSummaryDto.copyWith(...)`. Additionally contains functions for specific fields e.g. `instanceOfTripSummaryDto.copyWith.fieldName(...)`
class _$TripSummaryDtoCWProxyImpl implements _$TripSummaryDtoCWProxy {
  const _$TripSummaryDtoCWProxyImpl(this._value);

  final TripSummaryDto _value;

  @override
  TripSummaryDto id(String id) => this(id: id);

  @override
  TripSummaryDto status(TripStatus status) => this(status: status);

  @override
  TripSummaryDto vehicle(TripVehicleDto vehicle) => this(vehicle: vehicle);

  @override
  TripSummaryDto driver(PersonDto driver) => this(driver: driver);

  @override
  TripSummaryDto scheduledStart(DateTime scheduledStart) =>
      this(scheduledStart: scheduledStart);

  @override
  TripSummaryDto scheduledEnd(DateTime scheduledEnd) =>
      this(scheduledEnd: scheduledEnd);

  @override
  /// This function **does support** nullification of nullable fields. All `null` values passed to `non-nullable` fields will be ignored. You can also use `TripSummaryDto(...).copyWith.fieldName(...)` to override fields one at a time with nullification support.
  ///
  /// Usage
  /// ```dart
  /// TripSummaryDto(...).copyWith(id: 12, name: "My name")
  /// ````
  TripSummaryDto call({
    Object? id = const $CopyWithPlaceholder(),
    Object? status = const $CopyWithPlaceholder(),
    Object? vehicle = const $CopyWithPlaceholder(),
    Object? driver = const $CopyWithPlaceholder(),
    Object? scheduledStart = const $CopyWithPlaceholder(),
    Object? scheduledEnd = const $CopyWithPlaceholder(),
  }) {
    return TripSummaryDto(
      id: id == const $CopyWithPlaceholder()
          ? _value.id
          // ignore: cast_nullable_to_non_nullable
          : id as String,
      status: status == const $CopyWithPlaceholder()
          ? _value.status
          // ignore: cast_nullable_to_non_nullable
          : status as TripStatus,
      vehicle: vehicle == const $CopyWithPlaceholder()
          ? _value.vehicle
          // ignore: cast_nullable_to_non_nullable
          : vehicle as TripVehicleDto,
      driver: driver == const $CopyWithPlaceholder()
          ? _value.driver
          // ignore: cast_nullable_to_non_nullable
          : driver as PersonDto,
      scheduledStart: scheduledStart == const $CopyWithPlaceholder()
          ? _value.scheduledStart
          // ignore: cast_nullable_to_non_nullable
          : scheduledStart as DateTime,
      scheduledEnd: scheduledEnd == const $CopyWithPlaceholder()
          ? _value.scheduledEnd
          // ignore: cast_nullable_to_non_nullable
          : scheduledEnd as DateTime,
    );
  }
}

extension $TripSummaryDtoCopyWith on TripSummaryDto {
  /// Returns a callable class that can be used as follows: `instanceOfTripSummaryDto.copyWith(...)` or like so:`instanceOfTripSummaryDto.copyWith.fieldName(...)`.
  // ignore: library_private_types_in_public_api
  _$TripSummaryDtoCWProxy get copyWith => _$TripSummaryDtoCWProxyImpl(this);
}

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

TripSummaryDto _$TripSummaryDtoFromJson(Map<String, dynamic> json) =>
    $checkedCreate('TripSummaryDto', json, ($checkedConvert) {
      $checkKeys(
        json,
        requiredKeys: const [
          'id',
          'status',
          'vehicle',
          'driver',
          'scheduledStart',
          'scheduledEnd',
        ],
      );
      final val = TripSummaryDto(
        id: $checkedConvert('id', (v) => v as String),
        status: $checkedConvert(
          'status',
          (v) => $enumDecode(_$TripStatusEnumMap, v),
        ),
        vehicle: $checkedConvert(
          'vehicle',
          (v) => TripVehicleDto.fromJson(v as Map<String, dynamic>),
        ),
        driver: $checkedConvert(
          'driver',
          (v) => PersonDto.fromJson(v as Map<String, dynamic>),
        ),
        scheduledStart: $checkedConvert(
          'scheduledStart',
          (v) => DateTime.parse(v as String),
        ),
        scheduledEnd: $checkedConvert(
          'scheduledEnd',
          (v) => DateTime.parse(v as String),
        ),
      );
      return val;
    });

Map<String, dynamic> _$TripSummaryDtoToJson(TripSummaryDto instance) =>
    <String, dynamic>{
      'id': instance.id,
      'status': _$TripStatusEnumMap[instance.status]!,
      'vehicle': instance.vehicle.toJson(),
      'driver': instance.driver.toJson(),
      'scheduledStart': instance.scheduledStart.toIso8601String(),
      'scheduledEnd': instance.scheduledEnd.toIso8601String(),
    };

const _$TripStatusEnumMap = {
  TripStatus.scheduled: 'scheduled',
  TripStatus.inProgress: 'in_progress',
  TripStatus.completed: 'completed',
  TripStatus.cancelled: 'cancelled',
};
