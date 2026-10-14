// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'reassign_dto.dart';

// **************************************************************************
// CopyWithGenerator
// **************************************************************************

abstract class _$ReassignDtoCWProxy {
  ReassignDto vehicleId(String? vehicleId);

  ReassignDto driverId(String? driverId);

  /// This function **does support** nullification of nullable fields. All `null` values passed to `non-nullable` fields will be ignored. You can also use `ReassignDto(...).copyWith.fieldName(...)` to override fields one at a time with nullification support.
  ///
  /// Usage
  /// ```dart
  /// ReassignDto(...).copyWith(id: 12, name: "My name")
  /// ````
  ReassignDto call({String? vehicleId, String? driverId});
}

/// Proxy class for `copyWith` functionality. This is a callable class and can be used as follows: `instanceOfReassignDto.copyWith(...)`. Additionally contains functions for specific fields e.g. `instanceOfReassignDto.copyWith.fieldName(...)`
class _$ReassignDtoCWProxyImpl implements _$ReassignDtoCWProxy {
  const _$ReassignDtoCWProxyImpl(this._value);

  final ReassignDto _value;

  @override
  ReassignDto vehicleId(String? vehicleId) => this(vehicleId: vehicleId);

  @override
  ReassignDto driverId(String? driverId) => this(driverId: driverId);

  @override
  /// This function **does support** nullification of nullable fields. All `null` values passed to `non-nullable` fields will be ignored. You can also use `ReassignDto(...).copyWith.fieldName(...)` to override fields one at a time with nullification support.
  ///
  /// Usage
  /// ```dart
  /// ReassignDto(...).copyWith(id: 12, name: "My name")
  /// ````
  ReassignDto call({
    Object? vehicleId = const $CopyWithPlaceholder(),
    Object? driverId = const $CopyWithPlaceholder(),
  }) {
    return ReassignDto(
      vehicleId: vehicleId == const $CopyWithPlaceholder()
          ? _value.vehicleId
          // ignore: cast_nullable_to_non_nullable
          : vehicleId as String?,
      driverId: driverId == const $CopyWithPlaceholder()
          ? _value.driverId
          // ignore: cast_nullable_to_non_nullable
          : driverId as String?,
    );
  }
}

extension $ReassignDtoCopyWith on ReassignDto {
  /// Returns a callable class that can be used as follows: `instanceOfReassignDto.copyWith(...)` or like so:`instanceOfReassignDto.copyWith.fieldName(...)`.
  // ignore: library_private_types_in_public_api
  _$ReassignDtoCWProxy get copyWith => _$ReassignDtoCWProxyImpl(this);
}

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ReassignDto _$ReassignDtoFromJson(Map<String, dynamic> json) =>
    $checkedCreate('ReassignDto', json, ($checkedConvert) {
      final val = ReassignDto(
        vehicleId: $checkedConvert('vehicleId', (v) => v as String?),
        driverId: $checkedConvert('driverId', (v) => v as String?),
      );
      return val;
    });

Map<String, dynamic> _$ReassignDtoToJson(ReassignDto instance) =>
    <String, dynamic>{
      'vehicleId': ?instance.vehicleId,
      'driverId': ?instance.driverId,
    };
