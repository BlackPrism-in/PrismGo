# prismgo_api.api.LiveApi

## Load the API package
```dart
import 'package:prismgo_api/api.dart';
```

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**liveControllerEnd**](LiveApi.md#livecontrollerend) | **POST** /api/v1/trips/{id}/end | 
[**liveControllerStart**](LiveApi.md#livecontrollerstart) | **POST** /api/v1/trips/{id}/start | 
[**liveControllerTrack**](LiveApi.md#livecontrollertrack) | **GET** /api/v1/trips/{id}/track | 
[**liveControllerVehicles**](LiveApi.md#livecontrollervehicles) | **GET** /api/v1/live/vehicles | 


# **liveControllerEnd**
> RequestDto liveControllerEnd(id)



### Example
```dart
import 'package:prismgo_api/api.dart';

final api = PrismgoApi().getLiveApi();
final String id = id_example; // String | 

try {
    final response = api.liveControllerEnd(id);
    print(response);
} on DioException catch (e) {
    print('Exception when calling LiveApi->liveControllerEnd: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**|  | 

### Return type

[**RequestDto**](RequestDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **liveControllerStart**
> RequestDto liveControllerStart(id)



### Example
```dart
import 'package:prismgo_api/api.dart';

final api = PrismgoApi().getLiveApi();
final String id = id_example; // String | 

try {
    final response = api.liveControllerStart(id);
    print(response);
} on DioException catch (e) {
    print('Exception when calling LiveApi->liveControllerStart: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**|  | 

### Return type

[**RequestDto**](RequestDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **liveControllerTrack**
> TripTrackDto liveControllerTrack(id)



### Example
```dart
import 'package:prismgo_api/api.dart';

final api = PrismgoApi().getLiveApi();
final String id = id_example; // String | 

try {
    final response = api.liveControllerTrack(id);
    print(response);
} on DioException catch (e) {
    print('Exception when calling LiveApi->liveControllerTrack: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**|  | 

### Return type

[**TripTrackDto**](TripTrackDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **liveControllerVehicles**
> List<LiveVehicleDto> liveControllerVehicles()



### Example
```dart
import 'package:prismgo_api/api.dart';

final api = PrismgoApi().getLiveApi();

try {
    final response = api.liveControllerVehicles();
    print(response);
} on DioException catch (e) {
    print('Exception when calling LiveApi->liveControllerVehicles: $e\n');
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**List&lt;LiveVehicleDto&gt;**](LiveVehicleDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

