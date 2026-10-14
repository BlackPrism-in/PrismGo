# prismgo_api.api.UsersApi

## Load the API package
```dart
import 'package:prismgo_api/api.dart';
```

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**usersControllerCreate**](UsersApi.md#userscontrollercreate) | **POST** /api/v1/users | 
[**usersControllerGet**](UsersApi.md#userscontrollerget) | **GET** /api/v1/users/{id} | 
[**usersControllerList**](UsersApi.md#userscontrollerlist) | **GET** /api/v1/users | 
[**usersControllerUpdate**](UsersApi.md#userscontrollerupdate) | **PATCH** /api/v1/users/{id} | 


# **usersControllerCreate**
> UserDto usersControllerCreate(createUserDto)



### Example
```dart
import 'package:prismgo_api/api.dart';

final api = PrismgoApi().getUsersApi();
final CreateUserDto createUserDto = ; // CreateUserDto | 

try {
    final response = api.usersControllerCreate(createUserDto);
    print(response);
} on DioException catch (e) {
    print('Exception when calling UsersApi->usersControllerCreate: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **createUserDto** | [**CreateUserDto**](CreateUserDto.md)|  | 

### Return type

[**UserDto**](UserDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **usersControllerGet**
> UserDto usersControllerGet(id)



### Example
```dart
import 'package:prismgo_api/api.dart';

final api = PrismgoApi().getUsersApi();
final String id = id_example; // String | 

try {
    final response = api.usersControllerGet(id);
    print(response);
} on DioException catch (e) {
    print('Exception when calling UsersApi->usersControllerGet: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**|  | 

### Return type

[**UserDto**](UserDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **usersControllerList**
> List<UserDto> usersControllerList(role, departmentId, status, q)



### Example
```dart
import 'package:prismgo_api/api.dart';

final api = PrismgoApi().getUsersApi();
final Role role = ; // Role | 
final String departmentId = departmentId_example; // String | 
final UserStatus status = ; // UserStatus | 
final String q = q_example; // String | Matches name or phone

try {
    final response = api.usersControllerList(role, departmentId, status, q);
    print(response);
} on DioException catch (e) {
    print('Exception when calling UsersApi->usersControllerList: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **role** | [**Role**](.md)|  | [optional] 
 **departmentId** | **String**|  | [optional] 
 **status** | [**UserStatus**](.md)|  | [optional] 
 **q** | **String**| Matches name or phone | [optional] 

### Return type

[**List&lt;UserDto&gt;**](UserDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **usersControllerUpdate**
> UserDto usersControllerUpdate(id, updateUserDto)



### Example
```dart
import 'package:prismgo_api/api.dart';

final api = PrismgoApi().getUsersApi();
final String id = id_example; // String | 
final UpdateUserDto updateUserDto = ; // UpdateUserDto | 

try {
    final response = api.usersControllerUpdate(id, updateUserDto);
    print(response);
} on DioException catch (e) {
    print('Exception when calling UsersApi->usersControllerUpdate: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**|  | 
 **updateUserDto** | [**UpdateUserDto**](UpdateUserDto.md)|  | 

### Return type

[**UserDto**](UserDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

