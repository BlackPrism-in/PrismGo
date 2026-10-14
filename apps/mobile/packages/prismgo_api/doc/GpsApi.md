# prismgo_api.api.GpsApi

## Load the API package
```dart
import 'package:prismgo_api/api.dart';
```

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**gpsWebhookControllerIngest**](GpsApi.md#gpswebhookcontrolleringest) | **POST** /api/v1/gps/webhook | 


# **gpsWebhookControllerIngest**
> GpsIngestResultDto gpsWebhookControllerIngest(xGPSSecret, gpsBatchDto)



### Example
```dart
import 'package:prismgo_api/api.dart';

final api = PrismgoApi().getGpsApi();
final String xGPSSecret = xGPSSecret_example; // String | 
final GpsBatchDto gpsBatchDto = ; // GpsBatchDto | 

try {
    final response = api.gpsWebhookControllerIngest(xGPSSecret, gpsBatchDto);
    print(response);
} on DioException catch (e) {
    print('Exception when calling GpsApi->gpsWebhookControllerIngest: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **xGPSSecret** | **String**|  | 
 **gpsBatchDto** | [**GpsBatchDto**](GpsBatchDto.md)|  | 

### Return type

[**GpsIngestResultDto**](GpsIngestResultDto.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

