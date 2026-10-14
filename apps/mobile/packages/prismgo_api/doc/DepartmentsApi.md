# prismgo_api.api.DepartmentsApi

## Load the API package
```dart
import 'package:prismgo_api/api.dart';
```

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**departmentsControllerCreate**](DepartmentsApi.md#departmentscontrollercreate) | **POST** /api/v1/departments | 
[**departmentsControllerList**](DepartmentsApi.md#departmentscontrollerlist) | **GET** /api/v1/departments | 
[**departmentsControllerUpdate**](DepartmentsApi.md#departmentscontrollerupdate) | **PATCH** /api/v1/departments/{id} | 


# **departmentsControllerCreate**
> DepartmentDto departmentsControllerCreate(createDepartmentDto)



### Example
```dart
import 'package:prismgo_api/api.dart';

final api = PrismgoApi().getDepartmentsApi();
final CreateDepartmentDto createDepartmentDto = ; // CreateDepartmentDto | 

try {
    final response = api.departmentsControllerCreate(createDepartmentDto);
    print(response);
} on DioException catch (e) {
    print('Exception when calling DepartmentsApi->departmentsControllerCreate: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **createDepartmentDto** | [**CreateDepartmentDto**](CreateDepartmentDto.md)|  | 

### Return type

[**DepartmentDto**](DepartmentDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **departmentsControllerList**
> List<DepartmentDto> departmentsControllerList()



### Example
```dart
import 'package:prismgo_api/api.dart';

final api = PrismgoApi().getDepartmentsApi();

try {
    final response = api.departmentsControllerList();
    print(response);
} on DioException catch (e) {
    print('Exception when calling DepartmentsApi->departmentsControllerList: $e\n');
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**List&lt;DepartmentDto&gt;**](DepartmentDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **departmentsControllerUpdate**
> DepartmentDto departmentsControllerUpdate(id, updateDepartmentDto)



### Example
```dart
import 'package:prismgo_api/api.dart';

final api = PrismgoApi().getDepartmentsApi();
final String id = id_example; // String | 
final UpdateDepartmentDto updateDepartmentDto = ; // UpdateDepartmentDto | 

try {
    final response = api.departmentsControllerUpdate(id, updateDepartmentDto);
    print(response);
} on DioException catch (e) {
    print('Exception when calling DepartmentsApi->departmentsControllerUpdate: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**|  | 
 **updateDepartmentDto** | [**UpdateDepartmentDto**](UpdateDepartmentDto.md)|  | 

### Return type

[**DepartmentDto**](DepartmentDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

