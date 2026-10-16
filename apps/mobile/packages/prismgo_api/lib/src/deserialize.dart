import 'package:prismgo_api/src/model/approve_dto.dart';
import 'package:prismgo_api/src/model/assign_dto.dart';
import 'package:prismgo_api/src/model/auth_response_dto.dart';
import 'package:prismgo_api/src/model/availability_dto.dart';
import 'package:prismgo_api/src/model/available_driver_dto.dart';
import 'package:prismgo_api/src/model/available_vehicle_dto.dart';
import 'package:prismgo_api/src/model/cancel_dto.dart';
import 'package:prismgo_api/src/model/conflict_dto.dart';
import 'package:prismgo_api/src/model/create_department_dto.dart';
import 'package:prismgo_api/src/model/create_driver_dto.dart';
import 'package:prismgo_api/src/model/create_request_dto.dart';
import 'package:prismgo_api/src/model/create_user_dto.dart';
import 'package:prismgo_api/src/model/create_vehicle_dto.dart';
import 'package:prismgo_api/src/model/department_dto.dart';
import 'package:prismgo_api/src/model/department_hod_dto.dart';
import 'package:prismgo_api/src/model/driver_dto.dart';
import 'package:prismgo_api/src/model/driver_vehicle_dto.dart';
import 'package:prismgo_api/src/model/gps_batch_dto.dart';
import 'package:prismgo_api/src/model/gps_ingest_result_dto.dart';
import 'package:prismgo_api/src/model/gps_point_dto.dart';
import 'package:prismgo_api/src/model/live_trip_dto.dart';
import 'package:prismgo_api/src/model/live_vehicle_dto.dart';
import 'package:prismgo_api/src/model/location_dto.dart';
import 'package:prismgo_api/src/model/me_department_dto.dart';
import 'package:prismgo_api/src/model/me_dto.dart';
import 'package:prismgo_api/src/model/named_dto.dart';
import 'package:prismgo_api/src/model/notification_dto.dart';
import 'package:prismgo_api/src/model/person_dto.dart';
import 'package:prismgo_api/src/model/position_dto.dart';
import 'package:prismgo_api/src/model/reassign_dto.dart';
import 'package:prismgo_api/src/model/refresh_dto.dart';
import 'package:prismgo_api/src/model/register_device_dto.dart';
import 'package:prismgo_api/src/model/reject_dto.dart';
import 'package:prismgo_api/src/model/request_dto.dart';
import 'package:prismgo_api/src/model/request_otp_dto.dart';
import 'package:prismgo_api/src/model/request_otp_response_dto.dart';
import 'package:prismgo_api/src/model/timeline_entry_dto.dart';
import 'package:prismgo_api/src/model/track_point_dto.dart';
import 'package:prismgo_api/src/model/trip_summary_dto.dart';
import 'package:prismgo_api/src/model/trip_track_dto.dart';
import 'package:prismgo_api/src/model/trip_vehicle_dto.dart';
import 'package:prismgo_api/src/model/unread_count_dto.dart';
import 'package:prismgo_api/src/model/update_department_dto.dart';
import 'package:prismgo_api/src/model/update_driver_dto.dart';
import 'package:prismgo_api/src/model/update_request_dto.dart';
import 'package:prismgo_api/src/model/update_user_dto.dart';
import 'package:prismgo_api/src/model/update_vehicle_dto.dart';
import 'package:prismgo_api/src/model/user_department_dto.dart';
import 'package:prismgo_api/src/model/user_dto.dart';
import 'package:prismgo_api/src/model/vehicle_dto.dart';
import 'package:prismgo_api/src/model/verify_otp_dto.dart';

final _regList = RegExp(r'^List<(.*)>$');
final _regSet = RegExp(r'^Set<(.*)>$');
final _regMap = RegExp(r'^Map<String,(.*)>$');

ReturnType deserialize<ReturnType, BaseType>(
  dynamic value,
  String targetType, {
  bool growable = true,
}) {
  switch (targetType) {
    case 'String':
      return '$value' as ReturnType;
    case 'int':
      return (value is int ? value : int.parse('$value')) as ReturnType;
    case 'bool':
      if (value is bool) {
        return value as ReturnType;
      }
      final valueString = '$value'.toLowerCase();
      return (valueString == 'true' || valueString == '1') as ReturnType;
    case 'double':
      return (value is double ? value : double.parse('$value')) as ReturnType;
    case 'ApproveDto':
      return ApproveDto.fromJson(value as Map<String, dynamic>) as ReturnType;
    case 'AssignDto':
      return AssignDto.fromJson(value as Map<String, dynamic>) as ReturnType;
    case 'AuthResponseDto':
      return AuthResponseDto.fromJson(value as Map<String, dynamic>)
          as ReturnType;
    case 'AvailabilityDto':
      return AvailabilityDto.fromJson(value as Map<String, dynamic>)
          as ReturnType;
    case 'AvailableDriverDto':
      return AvailableDriverDto.fromJson(value as Map<String, dynamic>)
          as ReturnType;
    case 'AvailableVehicleDto':
      return AvailableVehicleDto.fromJson(value as Map<String, dynamic>)
          as ReturnType;
    case 'CancelDto':
      return CancelDto.fromJson(value as Map<String, dynamic>) as ReturnType;
    case 'ConflictDto':
      return ConflictDto.fromJson(value as Map<String, dynamic>) as ReturnType;
    case 'CreateDepartmentDto':
      return CreateDepartmentDto.fromJson(value as Map<String, dynamic>)
          as ReturnType;
    case 'CreateDriverDto':
      return CreateDriverDto.fromJson(value as Map<String, dynamic>)
          as ReturnType;
    case 'CreateRequestDto':
      return CreateRequestDto.fromJson(value as Map<String, dynamic>)
          as ReturnType;
    case 'CreateUserDto':
      return CreateUserDto.fromJson(value as Map<String, dynamic>)
          as ReturnType;
    case 'CreateVehicleDto':
      return CreateVehicleDto.fromJson(value as Map<String, dynamic>)
          as ReturnType;
    case 'DepartmentDto':
      return DepartmentDto.fromJson(value as Map<String, dynamic>)
          as ReturnType;
    case 'DepartmentHodDto':
      return DepartmentHodDto.fromJson(value as Map<String, dynamic>)
          as ReturnType;
    case 'DriverDto':
      return DriverDto.fromJson(value as Map<String, dynamic>) as ReturnType;
    case 'DriverStatus':
    case 'DriverVehicleDto':
      return DriverVehicleDto.fromJson(value as Map<String, dynamic>)
          as ReturnType;
    case 'EtaTarget':
    case 'GpsBatchDto':
      return GpsBatchDto.fromJson(value as Map<String, dynamic>) as ReturnType;
    case 'GpsIngestResultDto':
      return GpsIngestResultDto.fromJson(value as Map<String, dynamic>)
          as ReturnType;
    case 'GpsPointDto':
      return GpsPointDto.fromJson(value as Map<String, dynamic>) as ReturnType;
    case 'LiveTripDto':
      return LiveTripDto.fromJson(value as Map<String, dynamic>) as ReturnType;
    case 'LiveTripStatus':
    case 'LiveVehicleDto':
      return LiveVehicleDto.fromJson(value as Map<String, dynamic>)
          as ReturnType;
    case 'LocationDto':
      return LocationDto.fromJson(value as Map<String, dynamic>) as ReturnType;
    case 'MeDepartmentDto':
      return MeDepartmentDto.fromJson(value as Map<String, dynamic>)
          as ReturnType;
    case 'MeDto':
      return MeDto.fromJson(value as Map<String, dynamic>) as ReturnType;
    case 'NamedDto':
      return NamedDto.fromJson(value as Map<String, dynamic>) as ReturnType;
    case 'NotificationDto':
      return NotificationDto.fromJson(value as Map<String, dynamic>)
          as ReturnType;
    case 'PersonDto':
      return PersonDto.fromJson(value as Map<String, dynamic>) as ReturnType;
    case 'PositionDto':
      return PositionDto.fromJson(value as Map<String, dynamic>) as ReturnType;
    case 'ReassignDto':
      return ReassignDto.fromJson(value as Map<String, dynamic>) as ReturnType;
    case 'RefreshDto':
      return RefreshDto.fromJson(value as Map<String, dynamic>) as ReturnType;
    case 'RegisterDeviceDto':
      return RegisterDeviceDto.fromJson(value as Map<String, dynamic>)
          as ReturnType;
    case 'RejectDto':
      return RejectDto.fromJson(value as Map<String, dynamic>) as ReturnType;
    case 'RequestDto':
      return RequestDto.fromJson(value as Map<String, dynamic>) as ReturnType;
    case 'RequestOtpDto':
      return RequestOtpDto.fromJson(value as Map<String, dynamic>)
          as ReturnType;
    case 'RequestOtpResponseDto':
      return RequestOtpResponseDto.fromJson(value as Map<String, dynamic>)
          as ReturnType;
    case 'RequestScope':
    case 'RequestStatus':
    case 'Role':
    case 'TimelineEntryDto':
      return TimelineEntryDto.fromJson(value as Map<String, dynamic>)
          as ReturnType;
    case 'TimelineType':
    case 'TrackPointDto':
      return TrackPointDto.fromJson(value as Map<String, dynamic>)
          as ReturnType;
    case 'TripStatus':
    case 'TripSummaryDto':
      return TripSummaryDto.fromJson(value as Map<String, dynamic>)
          as ReturnType;
    case 'TripTrackDto':
      return TripTrackDto.fromJson(value as Map<String, dynamic>) as ReturnType;
    case 'TripVehicleDto':
      return TripVehicleDto.fromJson(value as Map<String, dynamic>)
          as ReturnType;
    case 'UnreadCountDto':
      return UnreadCountDto.fromJson(value as Map<String, dynamic>)
          as ReturnType;
    case 'UpdateDepartmentDto':
      return UpdateDepartmentDto.fromJson(value as Map<String, dynamic>)
          as ReturnType;
    case 'UpdateDriverDto':
      return UpdateDriverDto.fromJson(value as Map<String, dynamic>)
          as ReturnType;
    case 'UpdateRequestDto':
      return UpdateRequestDto.fromJson(value as Map<String, dynamic>)
          as ReturnType;
    case 'UpdateUserDto':
      return UpdateUserDto.fromJson(value as Map<String, dynamic>)
          as ReturnType;
    case 'UpdateVehicleDto':
      return UpdateVehicleDto.fromJson(value as Map<String, dynamic>)
          as ReturnType;
    case 'UserDepartmentDto':
      return UserDepartmentDto.fromJson(value as Map<String, dynamic>)
          as ReturnType;
    case 'UserDto':
      return UserDto.fromJson(value as Map<String, dynamic>) as ReturnType;
    case 'UserStatus':
    case 'VehicleDto':
      return VehicleDto.fromJson(value as Map<String, dynamic>) as ReturnType;
    case 'VehicleStatus':
    case 'VerifyOtpDto':
      return VerifyOtpDto.fromJson(value as Map<String, dynamic>) as ReturnType;
    default:
      RegExpMatch? match;

      if (value is List && (match = _regList.firstMatch(targetType)) != null) {
        targetType = match![1]!; // ignore: parameter_assignments
        return value
                .map<BaseType>(
                  (dynamic v) => deserialize<BaseType, BaseType>(
                    v,
                    targetType,
                    growable: growable,
                  ),
                )
                .toList(growable: growable)
            as ReturnType;
      }
      if (value is Set && (match = _regSet.firstMatch(targetType)) != null) {
        targetType = match![1]!; // ignore: parameter_assignments
        return value
                .map<BaseType>(
                  (dynamic v) => deserialize<BaseType, BaseType>(
                    v,
                    targetType,
                    growable: growable,
                  ),
                )
                .toSet()
            as ReturnType;
      }
      if (value is Map && (match = _regMap.firstMatch(targetType)) != null) {
        targetType = match![1]!.trim(); // ignore: parameter_assignments
        return Map<String, BaseType>.fromIterables(
              value.keys as Iterable<String>,
              value.values.map(
                (dynamic v) => deserialize<BaseType, BaseType>(
                  v,
                  targetType,
                  growable: growable,
                ),
              ),
            )
            as ReturnType;
      }
      break;
  }
  throw Exception('Cannot deserialize');
}
