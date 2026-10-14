# prismgo_api.api.AssignmentsApi

## Load the API package
```dart
import 'package:prismgo_api/api.dart';
```

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**assignmentsControllerAssign**](AssignmentsApi.md#assignmentscontrollerassign) | **POST** /api/v1/requests/{id}/assign | 
[**assignmentsControllerAvailability**](AssignmentsApi.md#assignmentscontrolleravailability) | **GET** /api/v1/availability | 
[**assignmentsControllerReassign**](AssignmentsApi.md#assignmentscontrollerreassign) | **POST** /api/v1/trips/{id}/reassign | 


# **assignmentsControllerAssign**
> RequestDto assignmentsControllerAssign(id, assignDto)



### Example
```dart
import 'package:prismgo_api/api.dart';

final api = PrismgoApi().getAssignmentsApi();
final String id = id_example; // String | 
final AssignDto assignDto = ; // AssignDto | 

try {
    final response = api.assignmentsControllerAssign(id, assignDto);
    print(response);
} on DioException catch (e) {
    print('Exception when calling AssignmentsApi->assignmentsControllerAssign: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**|  | 
 **assignDto** | [**AssignDto**](AssignDto.md)|  | 

### Return type

[**RequestDto**](RequestDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **assignmentsControllerAvailability**
> AvailabilityDto assignmentsControllerAvailability(from, to, passengers)



### Example
```dart
import 'package:prismgo_api/api.dart';

final api = PrismgoApi().getAssignmentsApi();
final DateTime from = 2013-10-20T19:20:30+01:00; // DateTime | 
final DateTime to = 2013-10-20T19:20:30+01:00; // DateTime | 
final num passengers = 8.14; // num | Marks vehicles with too few seats

try {
    final response = api.assignmentsControllerAvailability(from, to, passengers);
    print(response);
} on DioException catch (e) {
    print('Exception when calling AssignmentsApi->assignmentsControllerAvailability: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **from** | **DateTime**|  | 
 **to** | **DateTime**|  | 
 **passengers** | **num**| Marks vehicles with too few seats | [optional] 

### Return type

[**AvailabilityDto**](AvailabilityDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **assignmentsControllerReassign**
> RequestDto assignmentsControllerReassign(id, reassignDto)



### Example
```dart
import 'package:prismgo_api/api.dart';

final api = PrismgoApi().getAssignmentsApi();
final String id = id_example; // String | 
final ReassignDto reassignDto = ; // ReassignDto | 

try {
    final response = api.assignmentsControllerReassign(id, reassignDto);
    print(response);
} on DioException catch (e) {
    print('Exception when calling AssignmentsApi->assignmentsControllerReassign: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**|  | 
 **reassignDto** | [**ReassignDto**](ReassignDto.md)|  | 

### Return type

[**RequestDto**](RequestDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

