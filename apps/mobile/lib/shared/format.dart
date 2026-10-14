import 'package:intl/intl.dart';
import 'package:prismgo_api/prismgo_api.dart';

final _dateTime = DateFormat('EEE d MMM, h:mm a');
final _time = DateFormat('h:mm a');

/// "Fri 16 Oct, 10:00 AM" in the phone's time zone.
String formatDateTime(DateTime d) => _dateTime.format(d.toLocal());
String formatTime(DateTime d) => _time.format(d.toLocal());

String timeAgo(DateTime d, {DateTime? now}) {
  final mins = (now ?? DateTime.now()).difference(d).inMinutes;
  if (mins < 1) return 'just now';
  if (mins < 60) return '$mins min ago';
  final hours = (mins / 60).round();
  if (hours < 24) return '$hours h ago';
  return formatDateTime(d);
}

String statusLabel(RequestStatus s) => switch (s) {
  RequestStatus.draft => 'Draft',
  RequestStatus.pendingApproval => 'Awaiting approval',
  RequestStatus.approved => 'Approved',
  RequestStatus.rejected => 'Not approved',
  RequestStatus.assigned => 'Vehicle assigned',
  RequestStatus.inProgress => 'On the way',
  RequestStatus.completed => 'Completed',
  RequestStatus.cancelled => 'Cancelled',
};

String timelineLabel(TimelineType t) => switch (t) {
  TimelineType.created => 'Request created',
  TimelineType.submitted => 'Submitted for approval',
  TimelineType.autoApproved => 'Approved (requester is the HOD)',
  TimelineType.approved => 'Approved',
  TimelineType.rejected => 'Not approved',
  TimelineType.assigned => 'Vehicle and driver assigned',
  TimelineType.reassigned => 'Vehicle or driver changed',
  TimelineType.started => 'Trip started',
  TimelineType.pickedUp => 'Picked up',
  TimelineType.dropped => 'Dropped off',
  TimelineType.ended => 'Trip completed',
  TimelineType.gpsLost => 'GPS signal lost',
  TimelineType.cancelled => 'Cancelled',
};

/// Parses "12.9716, 77.5946" (as copied from Google Maps); null when invalid.
({double lat, double lng})? parseCoords(String text) {
  final m = RegExp(
    r'^\s*(-?\d{1,2}(?:\.\d+)?)\s*,\s*(-?\d{1,3}(?:\.\d+)?)\s*$',
  ).firstMatch(text);
  if (m == null) return null;
  final lat = double.parse(m[1]!);
  final lng = double.parse(m[2]!);
  if (lat.abs() > 90 || lng.abs() > 180) return null;
  return (lat: lat, lng: lng);
}
