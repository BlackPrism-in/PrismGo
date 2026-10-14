# prismgo_api.model.LiveTripDto

## Load the model package
```dart
import 'package:prismgo_api/api.dart';
```

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **String** |  | 
**requestId** | **String** |  | 
**code** | **String** |  | 
**status** | [**LiveTripStatus**](LiveTripStatus.md) |  | 
**requesterName** | **String** |  | 
**pickupAddress** | **String** |  | 
**dropAddress** | **String** |  | 
**scheduledStart** | [**DateTime**](DateTime.md) |  | 
**etaMinutes** | **num** | Straight-line estimate until Google Directions is configured | [optional] 
**etaTo** | [**EtaTarget**](EtaTarget.md) |  | 

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


