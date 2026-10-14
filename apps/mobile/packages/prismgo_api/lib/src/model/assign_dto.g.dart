// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'assign_dto.dart';

// **************************************************************************
// CopyWithGenerator
// **************************************************************************

abstract class _$AssignDtoCWProxy {
  AssignDto vehicleId(String vehicleId);

  AssignDto driverId(String driverId);

  AssignDto scheduledEnd(DateTime? scheduledEnd);

  /// This function **does support** nullification of nullable fields. All `null` values passed to `non-nullable` fields will be ignored. You can also use `AssignDto(...).copyWith.fieldName(...)` to override fields one at a time with nullification support.
  ///
  /// Usage
  /// ```dart
  /// AssignDto(...).copyWith(id: 12, name: "My name")
  /// ````
  AssignDto call({String vehicleId, String driverId, DateTime? scheduledEnd});
}

/// Proxy class for `copyWith` functionality. This is a callable class and can be used as follows: `instanceOfAssignDto.copyWith(...)`. Additionally contains functions for specific fields e.g. `instanceOfAssignDto.copyWith.fieldName(...)`
class _$AssignDtoCWProxyImpl implements _$AssignDtoCWProxy {
  const _$AssignDtoCWProxyImpl(this._value);

  final AssignDto _value;

  @override
  AssignDto vehicleId(String vehicleId) => this(vehicleId: vehicleId);

  @override
  AssignDto driverId(String driverId) => this(driverId: driverId);

  @override
  AssignDto scheduledEnd(DateTime? scheduledEnd) =>
      this(scheduledEnd: scheduledEnd);

  @override
  /// This function **does support** nullification of nullable fields. All `null` values passed to `non-nullable` fields will be ignored. You can also use `AssignDto(...).copyWith.fieldName(...)` to override fields one at a time with nullification support.
  ///
  /// Usage
  /// ```dart
  /// AssignDto(...).copyWith(id: 12, name: "My name")
  /// ````
  AssignDto call({
    Object? vehicleId = const $CopyWithPlaceholder(),
    Object? driverId = const $CopyWithPlaceholder(),
    Object? scheduledEnd = const $CopyWithPlaceholder(),
  }) {
    return AssignDto(
      vehicleId: vehicleId == const $CopyWithPlaceholder()
          ? _value.vehicleId
          // ignore: cast_nullable_to_non_nullable
          : vehicleId as String,
      driverId: driverId == const $CopyWithPlaceholder()
          ? _value.driverId
          // ignore: cast_nullable_to_non_nullable
          : driverId as String,
      scheduledEnd: scheduledEnd == const $CopyWithPlaceholder()
          ? _value.scheduledEnd
          // ignore: cast_nullable_to_non_nullable
          : scheduledEnd as DateTime?,
    );
  }
}

extension $AssignDtoCopyWith on AssignDto {
  /// Returns a callable class that can be used as follows: `instanceOfAssignDto.copyWith(...)` or like so:`instanceOfAssignDto.copyWith.fieldName(...)`.
  // ignore: library_private_types_in_public_api
  _$AssignDtoCWProxy get copyWith => _$AssignDtoCWProxyImpl(this);
}

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

AssignDto _$AssignDtoFromJson(Map<String, dynamic> json) =>
    $checkedCreate('AssignDto', json, ($checkedConvert) {
      $checkKeys(json, requiredKeys: const ['vehicleId', 'driverId']);
      final val = AssignDto(
        vehicleId: $checkedConvert('vehicleId', (v) => v as String),
        driverId: $checkedConvert('driverId', (v) => v as String),
        scheduledEnd: $checkedConvert(
          'scheduledEnd',
          (v) => v == null ? null : DateTime.parse(v as String),
        ),
      );
      return val;
    });

Map<String, dynamic> _$AssignDtoToJson(AssignDto instance) => <String, dynamic>{
  'vehicleId': instance.vehicleId,
  'driverId': instance.driverId,
  'scheduledEnd': ?instance.scheduledEnd?.toIso8601String(),
};
