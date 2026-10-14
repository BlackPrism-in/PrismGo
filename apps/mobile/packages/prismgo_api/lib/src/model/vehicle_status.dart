//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:json_annotation/json_annotation.dart';

enum VehicleStatus {
  @JsonValue(r'available')
  available(r'available'),
  @JsonValue(r'on_trip')
  onTrip(r'on_trip'),
  @JsonValue(r'maintenance')
  maintenance(r'maintenance'),
  @JsonValue(r'inactive')
  inactive(r'inactive');

  const VehicleStatus(this.value);

  final String value;

  @override
  String toString() => value;
}
