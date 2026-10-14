//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:json_annotation/json_annotation.dart';

enum TripStatus {
  @JsonValue(r'scheduled')
  scheduled(r'scheduled'),
  @JsonValue(r'in_progress')
  inProgress(r'in_progress'),
  @JsonValue(r'completed')
  completed(r'completed'),
  @JsonValue(r'cancelled')
  cancelled(r'cancelled');

  const TripStatus(this.value);

  final String value;

  @override
  String toString() => value;
}
