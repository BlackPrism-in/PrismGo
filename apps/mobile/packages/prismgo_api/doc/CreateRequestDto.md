# prismgo_api.model.CreateRequestDto

## Load the model package
```dart
import 'package:prismgo_api/api.dart';
```

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**pickup** | [**LocationDto**](LocationDto.md) |  | 
**drop** | [**LocationDto**](LocationDto.md) |  | 
**startAt** | [**DateTime**](DateTime.md) |  | 
**returnAt** | [**DateTime**](DateTime.md) | Return trip time, if any | [optional] 
**passengers** | **num** |  | 
**purpose** | **String** |  | 
**notes** | **String** |  | [optional] 
**submit** | **bool** | Defaults to true; false saves a draft | [optional] 

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


