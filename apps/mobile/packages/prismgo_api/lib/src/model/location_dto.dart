//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:copy_with_extension/copy_with_extension.dart';
import 'package:json_annotation/json_annotation.dart';

part 'location_dto.g.dart';

@CopyWith()
@JsonSerializable(
  checked: true,
  createToJson: true,
  disallowUnrecognizedKeys: false,
  explicitToJson: true,
)
class LocationDto {
  /// Returns a new [LocationDto] instance.
  LocationDto({required this.address, required this.lat, required this.lng});

  @JsonKey(name: r'address', required: true, includeIfNull: false)
  final String address;

  @JsonKey(name: r'lat', required: true, includeIfNull: false)
  final num lat;

  @JsonKey(name: r'lng', required: true, includeIfNull: false)
  final num lng;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is LocationDto &&
          other.address == address &&
          other.lat == lat &&
          other.lng == lng;

  @override
  int get hashCode => address.hashCode + lat.hashCode + lng.hashCode;

  factory LocationDto.fromJson(Map<String, dynamic> json) =>
      _$LocationDtoFromJson(json);

  Map<String, dynamic> toJson() => _$LocationDtoToJson(this);

  @override
  String toString() {
    return toJson().toString();
  }
}
