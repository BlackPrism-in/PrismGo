import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:prismgo/core/realtime.dart';
import 'package:prismgo/features/auth/session_controller.dart';
import 'package:prismgo/features/home/api_health.dart';
import 'package:prismgo/features/notifications/notifications_providers.dart';
import 'package:prismgo/features/requests/requests_providers.dart';
import 'package:prismgo/features/tracking/trip_track.dart';
import 'package:prismgo_api/prismgo_api.dart';

MeDto me({
  List<Role> roles = const [Role.requester],
  String name = 'Rahul Requester',
}) => MeDto(
  id: 'u1',
  name: name,
  phone: '+919000000005',
  roles: roles,
  department: MeDepartmentDto(id: 'd1', name: 'Operations'),
  orgId: 'o1',
  orgName: 'PrismGo Demo',
);

RequestDto request({
  String id = 'r1',
  RequestStatus status = RequestStatus.pendingApproval,
  List<String> actions = const ['edit', 'cancel'],
  TripSummaryDto? trip,
}) => RequestDto(
  id: id,
  code: 'PG-1001',
  status: status,
  requester: PersonDto(
    id: 'u1',
    name: 'Rahul Requester',
    phone: '+919000000005',
  ),
  department: NamedDto(id: 'd1', name: 'Operations'),
  pickup: LocationDto(address: 'MG Road Office', lat: 12.97, lng: 77.6),
  drop: LocationDto(address: 'Bengaluru Airport', lat: 13.2, lng: 77.7),
  startAt: DateTime.utc(2026, 10, 16, 4, 30),
  passengers: 2,
  purpose: 'Client visit',
  trip: trip,
  timeline: [
    TimelineEntryDto(
      type: TimelineType.created,
      at: DateTime.utc(2026, 10, 14, 10),
    ),
    TimelineEntryDto(
      type: TimelineType.submitted,
      at: DateTime.utc(2026, 10, 14, 10),
    ),
  ],
  actions: actions,
  createdAt: DateTime.utc(2026, 10, 14, 10),
);

TripSummaryDto trip() => TripSummaryDto(
  id: 't1',
  status: TripStatus.scheduled,
  vehicle: TripVehicleDto(
    id: 'v1',
    regNo: 'KA01AB1001',
    type: 'Sedan',
    seats: 4,
  ),
  driver: PersonDto(id: 'dr1', name: 'Suresh Kumar', phone: '+919000000101'),
  scheduledStart: DateTime.utc(2026, 10, 16, 4, 30),
  scheduledEnd: DateTime.utc(2026, 10, 16, 6, 30),
);

/// In-memory session: no network, no secure storage.
class FakeSession extends SessionController {
  FakeSession(this.initial);

  final MeDto? initial;
  String? requestedPhone;
  String? verifiedCode;

  @override
  Future<MeDto?> build() async => initial;

  @override
  Future<String?> requestCode(String phone) async {
    requestedPhone = phone;
    return '424242';
  }

  @override
  Future<void> verifyCode(String phone, String code) async {
    verifiedCode = code;
    state = AsyncData(me());
  }

  @override
  Future<void> logout() async => state = const AsyncData(null);
}

/// Records actions instead of calling the API.
class FakeActions extends RequestActions {
  FakeActions(super.ref);

  final calls = <String>[];

  @override
  Future<RequestDto> approve(String id, String? comment) async {
    calls.add('approve:$id:${comment ?? ''}');
    return request(id: id, status: RequestStatus.approved, actions: const []);
  }

  @override
  Future<RequestDto> reject(String id, String comment) async {
    calls.add('reject:$id:$comment');
    return request(id: id, status: RequestStatus.rejected, actions: const []);
  }

  @override
  Future<RequestDto> cancel(String id, String? reason) async {
    calls.add('cancel:$id:${reason ?? ''}');
    return request(id: id, status: RequestStatus.cancelled, actions: const []);
  }
}

/// Overrides that keep widget tests offline.
List<Override> offline({
  required FakeSession session,
  List<RequestDto> mine = const [],
  List<RequestDto> pending = const [],
  Map<String, RequestDto> byId = const {},
  List<NotificationDto> notifications = const [],
  FakeActions Function(Ref ref)? actions,
}) => [
  sessionControllerProvider.overrideWith(() => session),
  apiHealthProvider.overrideWith((ref) async => ApiHealth.online),
  realtimeProvider.overrideWith((ref) {}),
  requestsProvider.overrideWith(
    (ref, q) async => q.scope == RequestScope.mine ? mine : pending,
  ),
  requestProvider.overrideWith((ref, id) async => byId[id] ?? request(id: id)),
  notificationsProvider.overrideWith((ref) async => notifications),
  tripTrackProvider.overrideWith((ref, id) async => track()),
  if (actions != null) requestActionsProvider.overrideWith(actions),
];

TripTrackDto track() => TripTrackDto(
  tripId: 't1',
  requestId: 'r1',
  status: TripStatus.scheduled,
  vehicleRegNo: 'KA01AB1001',
  pickup: TrackPointDto(
    lat: 12.97,
    lng: 77.6,
    at: DateTime.utc(2026, 10, 16, 4, 30),
  ),
  drop: TrackPointDto(
    lat: 13.2,
    lng: 77.7,
    at: DateTime.utc(2026, 10, 16, 4, 30),
  ),
  points: const [],
  etaTo: EtaTarget.pickup,
);
