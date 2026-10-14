# prismgo_api.model.GpsIngestResultDto

## Load the model package
```dart
import 'package:prismgo_api/api.dart';
```

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**accepted** | **num** |  | 
**duplicates** | **num** | Already stored (same vehicle and time) | 
**rejected** | **num** | Too old, in the future, or for an unknown device | 
**unknownDevices** | **List&lt;String&gt;** | Device ids not linked to any vehicle | 

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


