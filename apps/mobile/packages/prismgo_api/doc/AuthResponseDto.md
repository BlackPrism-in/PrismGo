# prismgo_api.model.AuthResponseDto

## Load the model package
```dart
import 'package:prismgo_api/api.dart';
```

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**accessToken** | **String** |  | 
**refreshToken** | **String** | Omitted for web clients (sent as an httpOnly cookie) | [optional] 
**expiresIn** | **num** | Access token lifetime in seconds | 
**user** | [**MeDto**](MeDto.md) |  | 

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


