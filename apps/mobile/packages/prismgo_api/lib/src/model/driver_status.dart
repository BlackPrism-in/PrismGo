//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:json_annotation/json_annotation.dart';

enum DriverStatus {
  @JsonValue(r'active')
  active(r'active'),
  @JsonValue(r'on_leave')
  onLeave(r'on_leave'),
  @JsonValue(r'inactive')
  inactive(r'inactive');

  const DriverStatus(this.value);

  final String value;

  @override
  String toString() => value;
}
