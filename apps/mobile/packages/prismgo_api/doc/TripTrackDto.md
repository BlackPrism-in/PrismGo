# prismgo_api.model.TripTrackDto

## Load the model package
```dart
import 'package:prismgo_api/api.dart';
```

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**tripId** | **String** |  | 
**requestId** | **String** |  | 
**status** | [**TripStatus**](TripStatus.md) |  | 
**vehicleRegNo** | **String** |  | 
**pickup** | [**TrackPointDto**](TrackPointDto.md) |  | 
**drop** | [**TrackPointDto**](TrackPointDto.md) |  | 
**points** | [**List&lt;TrackPointDto&gt;**](TrackPointDto.md) | Driven path (at most 2000 points) | 
**position** | [**PositionDto**](PositionDto.md) |  | [optional] 
**etaMinutes** | **num** |  | [optional] 
**etaTo** | [**EtaTarget**](EtaTarget.md) |  | 

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


