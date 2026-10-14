# prismgo_api.api.DriversApi

## Load the API package
```dart
import 'package:prismgo_api/api.dart';
```

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**driversControllerCreate**](DriversApi.md#driverscontrollercreate) | **POST** /api/v1/drivers | 
[**driversControllerList**](DriversApi.md#driverscontrollerlist) | **GET** /api/v1/drivers | 
[**driversControllerUpdate**](DriversApi.md#driverscontrollerupdate) | **PATCH** /api/v1/drivers/{id} | 


# **driversControllerCreate**
> DriverDto driversControllerCreate(createDriverDto)



### Example
```dart
import 'package:prismgo_api/api.dart';

final api = PrismgoApi().getDriversApi();
final CreateDriverDto createDriverDto = ; // CreateDriverDto | 

try {
    final response = api.driversControllerCreate(createDriverDto);
    print(response);
} on DioException catch (e) {
    print('Exception when calling DriversApi->driversControllerCreate: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **createDriverDto** | [**CreateDriverDto**](CreateDriverDto.md)|  | 

### Return type

[**DriverDto**](DriverDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **driversControllerList**
> List<DriverDto> driversControllerList()



### Example
```dart
import 'package:prismgo_api/api.dart';

final api = PrismgoApi().getDriversApi();

try {
    final response = api.driversControllerList();
    print(response);
} on DioException catch (e) {
    print('Exception when calling DriversApi->driversControllerList: $e\n');
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**List&lt;DriverDto&gt;**](DriverDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **driversControllerUpdate**
> DriverDto driversControllerUpdate(id, updateDriverDto)



### Example
```dart
import 'package:prismgo_api/api.dart';

final api = PrismgoApi().getDriversApi();
final String id = id_example; // String | 
final UpdateDriverDto updateDriverDto = ; // UpdateDriverDto | 

try {
    final response = api.driversControllerUpdate(id, updateDriverDto);
    print(response);
} on DioException catch (e) {
    print('Exception when calling DriversApi->driversControllerUpdate: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**|  | 
 **updateDriverDto** | [**UpdateDriverDto**](UpdateDriverDto.md)|  | 

### Return type

[**DriverDto**](DriverDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

