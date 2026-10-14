// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'live_trip_dto.dart';

// **************************************************************************
// CopyWithGenerator
// **************************************************************************

abstract class _$LiveTripDtoCWProxy {
  LiveTripDto id(String id);

  LiveTripDto requestId(String requestId);

  LiveTripDto code(String code);

  LiveTripDto status(LiveTripStatus status);

  LiveTripDto requesterName(String requesterName);

  LiveTripDto pickupAddress(String pickupAddress);

  LiveTripDto dropAddress(String dropAddress);

  LiveTripDto scheduledStart(DateTime scheduledStart);

  LiveTripDto etaMinutes(num? etaMinutes);

  LiveTripDto etaTo(EtaTarget etaTo);

  /// This function **does support** nullification of nullable fields. All `null` values passed to `non-nullable` fields will be ignored. You can also use `LiveTripDto(...).copyWith.fieldName(...)` to override fields one at a time with nullification support.
  ///
  /// Usage
  /// ```dart
  /// LiveTripDto(...).copyWith(id: 12, name: "My name")
  /// ````
  LiveTripDto call({
    String id,
    String requestId,
    String code,
    LiveTripStatus status,
    String requesterName,
    String pickupAddress,
    String dropAddress,
    DateTime scheduledStart,
    num? etaMinutes,
    EtaTarget etaTo,
  });
}

/// Proxy class for `copyWith` functionality. This is a callable class and can be used as follows: `instanceOfLiveTripDto.copyWith(...)`. Additionally contains functions for specific fields e.g. `instanceOfLiveTripDto.copyWith.fieldName(...)`
class _$LiveTripDtoCWProxyImpl implements _$LiveTripDtoCWProxy {
  const _$LiveTripDtoCWProxyImpl(this._value);

  final LiveTripDto _value;

  @override
  LiveTripDto id(String id) => this(id: id);

  @override
  LiveTripDto requestId(String requestId) => this(requestId: requestId);

  @override
  LiveTripDto code(String code) => this(code: code);

  @override
  LiveTripDto status(LiveTripStatus status) => this(status: status);

  @override
  LiveTripDto requesterName(String requesterName) =>
      this(requesterName: requesterName);

  @override
  LiveTripDto pickupAddress(String pickupAddress) =>
      this(pickupAddress: pickupAddress);

  @override
  LiveTripDto dropAddress(String dropAddress) => this(dropAddress: dropAddress);

  @override
  LiveTripDto scheduledStart(DateTime scheduledStart) =>
      this(scheduledStart: scheduledStart);

  @override
  LiveTripDto etaMinutes(num? etaMinutes) => this(etaMinutes: etaMinutes);

  @override
  LiveTripDto etaTo(EtaTarget etaTo) => this(etaTo: etaTo);

  @override
  /// This function **does support** nullification of nullable fields. All `null` values passed to `non-nullable` fields will be ignored. You can also use `LiveTripDto(...).copyWith.fieldName(...)` to override fields one at a time with nullification support.
  ///
  /// Usage
  /// ```dart
  /// LiveTripDto(...).copyWith(id: 12, name: "My name")
  /// ````
  LiveTripDto call({
    Object? id = const $CopyWithPlaceholder(),
    Object? requestId = const $CopyWithPlaceholder(),
    Object? code = const $CopyWithPlaceholder(),
    Object? status = const $CopyWithPlaceholder(),
    Object? requesterName = const $CopyWithPlaceholder(),
    Object? pickupAddress = const $CopyWithPlaceholder(),
    Object? dropAddress = const $CopyWithPlaceholder(),
    Object? scheduledStart = const $CopyWithPlaceholder(),
    Object? etaMinutes = const $CopyWithPlaceholder(),
    Object? etaTo = const $CopyWithPlaceholder(),
  }) {
    return LiveTripDto(
      id: id == const $CopyWithPlaceholder()
          ? _value.id
          // ignore: cast_nullable_to_non_nullable
          : id as String,
      requestId: requestId == const $CopyWithPlaceholder()
          ? _value.requestId
          // ignore: cast_nullable_to_non_nullable
          : requestId as String,
      code: code == const $CopyWithPlaceholder()
          ? _value.code
          // ignore: cast_nullable_to_non_nullable
          : code as String,
      status: status == const $CopyWithPlaceholder()
          ? _value.status
          // ignore: cast_nullable_to_non_nullable
          : status as LiveTripStatus,
      requesterName: requesterName == const $CopyWithPlaceholder()
          ? _value.requesterName
          // ignore: cast_nullable_to_non_nullable
          : requesterName as String,
      pickupAddress: pickupAddress == const $CopyWithPlaceholder()
          ? _value.pickupAddress
          // ignore: cast_nullable_to_non_nullable
          : pickupAddress as String,
      dropAddress: dropAddress == const $CopyWithPlaceholder()
          ? _value.dropAddress
          // ignore: cast_nullable_to_non_nullable
          : dropAddress as String,
      scheduledStart: scheduledStart == const $CopyWithPlaceholder()
          ? _value.scheduledStart
          // ignore: cast_nullable_to_non_nullable
          : scheduledStart as DateTime,
      etaMinutes: etaMinutes == const $CopyWithPlaceholder()
          ? _value.etaMinutes
          // ignore: cast_nullable_to_non_nullable
          : etaMinutes as num?,
      etaTo: etaTo == const $CopyWithPlaceholder()
          ? _value.etaTo
          // ignore: cast_nullable_to_non_nullable
          : etaTo as EtaTarget,
    );
  }
}

extension $LiveTripDtoCopyWith on LiveTripDto {
  /// Returns a callable class that can be used as follows: `instanceOfLiveTripDto.copyWith(...)` or like so:`instanceOfLiveTripDto.copyWith.fieldName(...)`.
  // ignore: library_private_types_in_public_api
  _$LiveTripDtoCWProxy get copyWith => _$LiveTripDtoCWProxyImpl(this);
}

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

LiveTripDto _$LiveTripDtoFromJson(Map<String, dynamic> json) =>
    $checkedCreate('LiveTripDto', json, ($checkedConvert) {
      $checkKeys(
        json,
        requiredKeys: const [
          'id',
          'requestId',
          'code',
          'status',
          'requesterName',
          'pickupAddress',
          'dropAddress',
          'scheduledStart',
          'etaTo',
        ],
      );
      final val = LiveTripDto(
        id: $checkedConvert('id', (v) => v as String),
        requestId: $checkedConvert('requestId', (v) => v as String),
        code: $checkedConvert('code', (v) => v as String),
        status: $checkedConvert(
          'status',
          (v) => $enumDecode(_$LiveTripStatusEnumMap, v),
        ),
        requesterName: $checkedConvert('requesterName', (v) => v as String),
        pickupAddress: $checkedConvert('pickupAddress', (v) => v as String),
        dropAddress: $checkedConvert('dropAddress', (v) => v as String),
        scheduledStart: $checkedConvert(
          'scheduledStart',
          (v) => DateTime.parse(v as String),
        ),
        etaMinutes: $checkedConvert('etaMinutes', (v) => v as num?),
        etaTo: $checkedConvert(
          'etaTo',
          (v) => $enumDecode(_$EtaTargetEnumMap, v),
        ),
      );
      return val;
    });

Map<String, dynamic> _$LiveTripDtoToJson(LiveTripDto instance) =>
    <String, dynamic>{
      'id': instance.id,
      'requestId': instance.requestId,
      'code': instance.code,
      'status': _$LiveTripStatusEnumMap[instance.status]!,
      'requesterName': instance.requesterName,
      'pickupAddress': instance.pickupAddress,
      'dropAddress': instance.dropAddress,
      'scheduledStart': instance.scheduledStart.toIso8601String(),
      'etaMinutes': ?instance.etaMinutes,
      'etaTo': _$EtaTargetEnumMap[instance.etaTo]!,
    };

const _$LiveTripStatusEnumMap = {
  LiveTripStatus.scheduled: 'scheduled',
  LiveTripStatus.inProgress: 'in_progress',
};

const _$EtaTargetEnumMap = {EtaTarget.pickup: 'pickup', EtaTarget.drop: 'drop'};
