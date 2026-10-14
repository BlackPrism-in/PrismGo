# prismgo_api.api.AuthApi

## Load the API package
```dart
import 'package:prismgo_api/api.dart';
```

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**authControllerLogout**](AuthApi.md#authcontrollerlogout) | **POST** /api/v1/auth/logout | 
[**authControllerMe**](AuthApi.md#authcontrollerme) | **GET** /api/v1/auth/me | 
[**authControllerRefresh**](AuthApi.md#authcontrollerrefresh) | **POST** /api/v1/auth/refresh | 
[**authControllerRequestOtp**](AuthApi.md#authcontrollerrequestotp) | **POST** /api/v1/auth/otp/request | 
[**authControllerVerifyOtp**](AuthApi.md#authcontrollerverifyotp) | **POST** /api/v1/auth/otp/verify | 


# **authControllerLogout**
> authControllerLogout(refreshDto, xClient)



### Example
```dart
import 'package:prismgo_api/api.dart';

final api = PrismgoApi().getAuthApi();
final RefreshDto refreshDto = ; // RefreshDto | 
final String xClient = xClient_example; // String | \"web\" for browser sessions

try {
    api.authControllerLogout(refreshDto, xClient);
} on DioException catch (e) {
    print('Exception when calling AuthApi->authControllerLogout: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **refreshDto** | [**RefreshDto**](RefreshDto.md)|  | 
 **xClient** | **String**| \"web\" for browser sessions | [optional] 

### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **authControllerMe**
> MeDto authControllerMe(xClient)



### Example
```dart
import 'package:prismgo_api/api.dart';

final api = PrismgoApi().getAuthApi();
final String xClient = xClient_example; // String | \"web\" for browser sessions

try {
    final response = api.authControllerMe(xClient);
    print(response);
} on DioException catch (e) {
    print('Exception when calling AuthApi->authControllerMe: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **xClient** | **String**| \"web\" for browser sessions | [optional] 

### Return type

[**MeDto**](MeDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **authControllerRefresh**
> AuthResponseDto authControllerRefresh(refreshDto, xClient)



### Example
```dart
import 'package:prismgo_api/api.dart';

final api = PrismgoApi().getAuthApi();
final RefreshDto refreshDto = ; // RefreshDto | 
final String xClient = xClient_example; // String | \"web\" for browser sessions

try {
    final response = api.authControllerRefresh(refreshDto, xClient);
    print(response);
} on DioException catch (e) {
    print('Exception when calling AuthApi->authControllerRefresh: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **refreshDto** | [**RefreshDto**](RefreshDto.md)|  | 
 **xClient** | **String**| \"web\" for browser sessions | [optional] 

### Return type

[**AuthResponseDto**](AuthResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **authControllerRequestOtp**
> RequestOtpResponseDto authControllerRequestOtp(requestOtpDto, xClient)



### Example
```dart
import 'package:prismgo_api/api.dart';

final api = PrismgoApi().getAuthApi();
final RequestOtpDto requestOtpDto = ; // RequestOtpDto | 
final String xClient = xClient_example; // String | \"web\" for browser sessions

try {
    final response = api.authControllerRequestOtp(requestOtpDto, xClient);
    print(response);
} on DioException catch (e) {
    print('Exception when calling AuthApi->authControllerRequestOtp: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **requestOtpDto** | [**RequestOtpDto**](RequestOtpDto.md)|  | 
 **xClient** | **String**| \"web\" for browser sessions | [optional] 

### Return type

[**RequestOtpResponseDto**](RequestOtpResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **authControllerVerifyOtp**
> AuthResponseDto authControllerVerifyOtp(verifyOtpDto, xClient)



### Example
```dart
import 'package:prismgo_api/api.dart';

final api = PrismgoApi().getAuthApi();
final VerifyOtpDto verifyOtpDto = ; // VerifyOtpDto | 
final String xClient = xClient_example; // String | \"web\" for browser sessions

try {
    final response = api.authControllerVerifyOtp(verifyOtpDto, xClient);
    print(response);
} on DioException catch (e) {
    print('Exception when calling AuthApi->authControllerVerifyOtp: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **verifyOtpDto** | [**VerifyOtpDto**](VerifyOtpDto.md)|  | 
 **xClient** | **String**| \"web\" for browser sessions | [optional] 

### Return type

[**AuthResponseDto**](AuthResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

