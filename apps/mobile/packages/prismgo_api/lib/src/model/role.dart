//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:json_annotation/json_annotation.dart';

enum Role {
  @JsonValue(r'requester')
  requester(r'requester'),
  @JsonValue(r'hod')
  hod(r'hod'),
  @JsonValue(r'transport_manager')
  transportManager(r'transport_manager'),
  @JsonValue(r'super_admin')
  superAdmin(r'super_admin');

  const Role(this.value);

  final String value;

  @override
  String toString() => value;
}
