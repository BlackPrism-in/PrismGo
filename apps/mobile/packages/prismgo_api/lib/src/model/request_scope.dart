//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:json_annotation/json_annotation.dart';

enum RequestScope {
  @JsonValue(r'mine')
  mine(r'mine'),
  @JsonValue(r'approvals')
  approvals(r'approvals'),
  @JsonValue(r'all')
  all(r'all');

  const RequestScope(this.value);

  final String value;

  @override
  String toString() => value;
}
