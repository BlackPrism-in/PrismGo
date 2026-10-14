# prismgo_api.api.NotificationsApi

## Load the API package
```dart
import 'package:prismgo_api/api.dart';
```

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**notificationsControllerList**](NotificationsApi.md#notificationscontrollerlist) | **GET** /api/v1/notifications | 
[**notificationsControllerMarkAllRead**](NotificationsApi.md#notificationscontrollermarkallread) | **POST** /api/v1/notifications/read-all | 
[**notificationsControllerMarkRead**](NotificationsApi.md#notificationscontrollermarkread) | **POST** /api/v1/notifications/{id}/read | 
[**notificationsControllerUnreadCount**](NotificationsApi.md#notificationscontrollerunreadcount) | **GET** /api/v1/notifications/unread-count | 


# **notificationsControllerList**
> List<NotificationDto> notificationsControllerList()



### Example
```dart
import 'package:prismgo_api/api.dart';

final api = PrismgoApi().getNotificationsApi();

try {
    final response = api.notificationsControllerList();
    print(response);
} on DioException catch (e) {
    print('Exception when calling NotificationsApi->notificationsControllerList: $e\n');
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**List&lt;NotificationDto&gt;**](NotificationDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **notificationsControllerMarkAllRead**
> notificationsControllerMarkAllRead()



### Example
```dart
import 'package:prismgo_api/api.dart';

final api = PrismgoApi().getNotificationsApi();

try {
    api.notificationsControllerMarkAllRead();
} on DioException catch (e) {
    print('Exception when calling NotificationsApi->notificationsControllerMarkAllRead: $e\n');
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **notificationsControllerMarkRead**
> notificationsControllerMarkRead(id)



### Example
```dart
import 'package:prismgo_api/api.dart';

final api = PrismgoApi().getNotificationsApi();
final String id = id_example; // String | 

try {
    api.notificationsControllerMarkRead(id);
} on DioException catch (e) {
    print('Exception when calling NotificationsApi->notificationsControllerMarkRead: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**|  | 

### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **notificationsControllerUnreadCount**
> UnreadCountDto notificationsControllerUnreadCount()



### Example
```dart
import 'package:prismgo_api/api.dart';

final api = PrismgoApi().getNotificationsApi();

try {
    final response = api.notificationsControllerUnreadCount();
    print(response);
} on DioException catch (e) {
    print('Exception when calling NotificationsApi->notificationsControllerUnreadCount: $e\n');
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**UnreadCountDto**](UnreadCountDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

