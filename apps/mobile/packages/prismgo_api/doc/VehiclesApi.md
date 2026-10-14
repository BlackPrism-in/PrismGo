# prismgo_api.api.VehiclesApi

## Load the API package
```dart
import 'package:prismgo_api/api.dart';
```

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**vehiclesControllerCreate**](VehiclesApi.md#vehiclescontrollercreate) | **POST** /api/v1/vehicles | 
[**vehiclesControllerList**](VehiclesApi.md#vehiclescontrollerlist) | **GET** /api/v1/vehicles | 
[**vehiclesControllerUpdate**](VehiclesApi.md#vehiclescontrollerupdate) | **PATCH** /api/v1/vehicles/{id} | 


# **vehiclesControllerCreate**
> VehicleDto vehiclesControllerCreate(createVehicleDto)



### Example
```dart
import 'package:prismgo_api/api.dart';

final api = PrismgoApi().getVehiclesApi();
final CreateVehicleDto createVehicleDto = ; // CreateVehicleDto | 

try {
    final response = api.vehiclesControllerCreate(createVehicleDto);
    print(response);
} on DioException catch (e) {
    print('Exception when calling VehiclesApi->vehiclesControllerCreate: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **createVehicleDto** | [**CreateVehicleDto**](CreateVehicleDto.md)|  | 

### Return type

[**VehicleDto**](VehicleDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **vehiclesControllerList**
> List<VehicleDto> vehiclesControllerList()



### Example
```dart
import 'package:prismgo_api/api.dart';

final api = PrismgoApi().getVehiclesApi();

try {
    final response = api.vehiclesControllerList();
    print(response);
} on DioException catch (e) {
    print('Exception when calling VehiclesApi->vehiclesControllerList: $e\n');
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**List&lt;VehicleDto&gt;**](VehicleDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **vehiclesControllerUpdate**
> VehicleDto vehiclesControllerUpdate(id, updateVehicleDto)



### Example
```dart
import 'package:prismgo_api/api.dart';

final api = PrismgoApi().getVehiclesApi();
final String id = id_example; // String | 
final UpdateVehicleDto updateVehicleDto = ; // UpdateVehicleDto | 

try {
    final response = api.vehiclesControllerUpdate(id, updateVehicleDto);
    print(response);
} on DioException catch (e) {
    print('Exception when calling VehiclesApi->vehiclesControllerUpdate: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**|  | 
 **updateVehicleDto** | [**UpdateVehicleDto**](UpdateVehicleDto.md)|  | 

### Return type

[**VehicleDto**](VehicleDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

