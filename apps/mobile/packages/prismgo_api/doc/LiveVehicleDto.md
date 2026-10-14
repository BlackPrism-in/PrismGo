# prismgo_api.model.LiveVehicleDto

## Load the model package
```dart
import 'package:prismgo_api/api.dart';
```

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **String** |  | 
**regNo** | **String** |  | 
**type** | **String** |  | 
**status** | [**VehicleStatus**](VehicleStatus.md) |  | 
**gpsDeviceId** | **String** |  | [optional] 
**position** | [**PositionDto**](PositionDto.md) |  | [optional] 
**stale** | **bool** | No position in the last 5 minutes | 
**trip** | [**LiveTripDto**](LiveTripDto.md) | In progress, or the next one within an hour | [optional] 

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


