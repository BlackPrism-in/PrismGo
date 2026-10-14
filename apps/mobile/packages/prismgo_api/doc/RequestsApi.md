# prismgo_api.api.RequestsApi

## Load the API package
```dart
import 'package:prismgo_api/api.dart';
```

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**requestsControllerApprove**](RequestsApi.md#requestscontrollerapprove) | **POST** /api/v1/requests/{id}/approve | 
[**requestsControllerCancel**](RequestsApi.md#requestscontrollercancel) | **POST** /api/v1/requests/{id}/cancel | 
[**requestsControllerCreate**](RequestsApi.md#requestscontrollercreate) | **POST** /api/v1/requests | 
[**requestsControllerGet**](RequestsApi.md#requestscontrollerget) | **GET** /api/v1/requests/{id} | 
[**requestsControllerList**](RequestsApi.md#requestscontrollerlist) | **GET** /api/v1/requests | 
[**requestsControllerReject**](RequestsApi.md#requestscontrollerreject) | **POST** /api/v1/requests/{id}/reject | 
[**requestsControllerSubmit**](RequestsApi.md#requestscontrollersubmit) | **POST** /api/v1/requests/{id}/submit | 
[**requestsControllerUpdate**](RequestsApi.md#requestscontrollerupdate) | **PATCH** /api/v1/requests/{id} | 


# **requestsControllerApprove**
> RequestDto requestsControllerApprove(id, approveDto)



### Example
```dart
import 'package:prismgo_api/api.dart';

final api = PrismgoApi().getRequestsApi();
final String id = id_example; // String | 
final ApproveDto approveDto = ; // ApproveDto | 

try {
    final response = api.requestsControllerApprove(id, approveDto);
    print(response);
} on DioException catch (e) {
    print('Exception when calling RequestsApi->requestsControllerApprove: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**|  | 
 **approveDto** | [**ApproveDto**](ApproveDto.md)|  | 

### Return type

[**RequestDto**](RequestDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **requestsControllerCancel**
> RequestDto requestsControllerCancel(id, cancelDto)



### Example
```dart
import 'package:prismgo_api/api.dart';

final api = PrismgoApi().getRequestsApi();
final String id = id_example; // String | 
final CancelDto cancelDto = ; // CancelDto | 

try {
    final response = api.requestsControllerCancel(id, cancelDto);
    print(response);
} on DioException catch (e) {
    print('Exception when calling RequestsApi->requestsControllerCancel: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**|  | 
 **cancelDto** | [**CancelDto**](CancelDto.md)|  | 

### Return type

[**RequestDto**](RequestDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **requestsControllerCreate**
> RequestDto requestsControllerCreate(createRequestDto)



### Example
```dart
import 'package:prismgo_api/api.dart';

final api = PrismgoApi().getRequestsApi();
final CreateRequestDto createRequestDto = ; // CreateRequestDto | 

try {
    final response = api.requestsControllerCreate(createRequestDto);
    print(response);
} on DioException catch (e) {
    print('Exception when calling RequestsApi->requestsControllerCreate: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **createRequestDto** | [**CreateRequestDto**](CreateRequestDto.md)|  | 

### Return type

[**RequestDto**](RequestDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **requestsControllerGet**
> RequestDto requestsControllerGet(id)



### Example
```dart
import 'package:prismgo_api/api.dart';

final api = PrismgoApi().getRequestsApi();
final String id = id_example; // String | 

try {
    final response = api.requestsControllerGet(id);
    print(response);
} on DioException catch (e) {
    print('Exception when calling RequestsApi->requestsControllerGet: $e\n');
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

# **requestsControllerList**
> List<RequestDto> requestsControllerList(scope, status)



### Example
```dart
import 'package:prismgo_api/api.dart';

final api = PrismgoApi().getRequestsApi();
final RequestScope scope = ; // RequestScope | mine: my requests · approvals: departments I head · all: managers only
final RequestStatus status = ; // RequestStatus | 

try {
    final response = api.requestsControllerList(scope, status);
    print(response);
} on DioException catch (e) {
    print('Exception when calling RequestsApi->requestsControllerList: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **scope** | [**RequestScope**](.md)| mine: my requests · approvals: departments I head · all: managers only | [optional] 
 **status** | [**RequestStatus**](.md)|  | [optional] 

### Return type

[**List&lt;RequestDto&gt;**](RequestDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **requestsControllerReject**
> RequestDto requestsControllerReject(id, rejectDto)



### Example
```dart
import 'package:prismgo_api/api.dart';

final api = PrismgoApi().getRequestsApi();
final String id = id_example; // String | 
final RejectDto rejectDto = ; // RejectDto | 

try {
    final response = api.requestsControllerReject(id, rejectDto);
    print(response);
} on DioException catch (e) {
    print('Exception when calling RequestsApi->requestsControllerReject: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**|  | 
 **rejectDto** | [**RejectDto**](RejectDto.md)|  | 

### Return type

[**RequestDto**](RequestDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **requestsControllerSubmit**
> RequestDto requestsControllerSubmit(id)



### Example
```dart
import 'package:prismgo_api/api.dart';

final api = PrismgoApi().getRequestsApi();
final String id = id_example; // String | 

try {
    final response = api.requestsControllerSubmit(id);
    print(response);
} on DioException catch (e) {
    print('Exception when calling RequestsApi->requestsControllerSubmit: $e\n');
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

# **requestsControllerUpdate**
> RequestDto requestsControllerUpdate(id, updateRequestDto)



### Example
```dart
import 'package:prismgo_api/api.dart';

final api = PrismgoApi().getRequestsApi();
final String id = id_example; // String | 
final UpdateRequestDto updateRequestDto = ; // UpdateRequestDto | 

try {
    final response = api.requestsControllerUpdate(id, updateRequestDto);
    print(response);
} on DioException catch (e) {
    print('Exception when calling RequestsApi->requestsControllerUpdate: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**|  | 
 **updateRequestDto** | [**UpdateRequestDto**](UpdateRequestDto.md)|  | 

### Return type

[**RequestDto**](RequestDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

