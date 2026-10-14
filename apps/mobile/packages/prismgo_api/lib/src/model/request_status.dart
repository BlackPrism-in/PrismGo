//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:json_annotation/json_annotation.dart';

enum RequestStatus {
  @JsonValue(r'draft')
  draft(r'draft'),
  @JsonValue(r'pending_approval')
  pendingApproval(r'pending_approval'),
  @JsonValue(r'approved')
  approved(r'approved'),
  @JsonValue(r'rejected')
  rejected(r'rejected'),
  @JsonValue(r'assigned')
  assigned(r'assigned'),
  @JsonValue(r'in_progress')
  inProgress(r'in_progress'),
  @JsonValue(r'completed')
  completed(r'completed'),
  @JsonValue(r'cancelled')
  cancelled(r'cancelled');

  const RequestStatus(this.value);

  final String value;

  @override
  String toString() => value;
}
