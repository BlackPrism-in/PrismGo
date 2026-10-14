//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:json_annotation/json_annotation.dart';

enum TimelineType {
  @JsonValue(r'created')
  created(r'created'),
  @JsonValue(r'submitted')
  submitted(r'submitted'),
  @JsonValue(r'auto_approved')
  autoApproved(r'auto_approved'),
  @JsonValue(r'approved')
  approved(r'approved'),
  @JsonValue(r'rejected')
  rejected(r'rejected'),
  @JsonValue(r'assigned')
  assigned(r'assigned'),
  @JsonValue(r'reassigned')
  reassigned(r'reassigned'),
  @JsonValue(r'started')
  started(r'started'),
  @JsonValue(r'picked_up')
  pickedUp(r'picked_up'),
  @JsonValue(r'dropped')
  dropped(r'dropped'),
  @JsonValue(r'ended')
  ended(r'ended'),
  @JsonValue(r'gps_lost')
  gpsLost(r'gps_lost'),
  @JsonValue(r'cancelled')
  cancelled(r'cancelled');

  const TimelineType(this.value);

  final String value;

  @override
  String toString() => value;
}
