# prismgo_api.model.RequestDto

## Load the model package
```dart
import 'package:prismgo_api/api.dart';
```

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **String** |  | 
**code** | **String** |  | 
**status** | [**RequestStatus**](RequestStatus.md) |  | 
**requester** | [**PersonDto**](PersonDto.md) |  | 
**department** | [**NamedDto**](NamedDto.md) |  | 
**pickup** | [**LocationDto**](LocationDto.md) |  | 
**drop** | [**LocationDto**](LocationDto.md) |  | 
**startAt** | [**DateTime**](DateTime.md) |  | 
**returnAt** | [**DateTime**](DateTime.md) |  | [optional] 
**passengers** | **num** |  | 
**purpose** | **String** |  | 
**notes** | **String** |  | [optional] 
**cancelReason** | **String** |  | [optional] 
**trip** | [**TripSummaryDto**](TripSummaryDto.md) | Current (non-cancelled) trip | [optional] 
**timeline** | [**List&lt;TimelineEntryDto&gt;**](TimelineEntryDto.md) |  | 
**actions** | **List&lt;String&gt;** | What the signed-in user may do now | 
**createdAt** | [**DateTime**](DateTime.md) |  | 

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


