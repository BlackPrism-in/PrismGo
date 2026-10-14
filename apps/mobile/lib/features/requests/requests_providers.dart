import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:prismgo_api/prismgo_api.dart';

import '../../core/api.dart';

/// Which list to load: the signed-in user's own requests, or their department's
/// (HOD), optionally filtered by status.
typedef RequestQuery = ({RequestScope scope, RequestStatus? status});

final requestsProvider = FutureProvider.autoDispose
    .family<List<RequestDto>, RequestQuery>((ref, q) async {
      final res = await ref
          .watch(apiProvider)
          .getRequestsApi()
          .requestsControllerList(scope: q.scope, status: q.status);
      return res.data ?? const [];
    });

final requestProvider = FutureProvider.autoDispose.family<RequestDto, String>((
  ref,
  id,
) async {
  final res = await ref
      .watch(apiProvider)
      .getRequestsApi()
      .requestsControllerGet(id: id);
  return res.data!;
});

/// Pending approvals for an HOD (used for the tab badge too).
const pendingApprovalsQuery = (
  scope: RequestScope.approvals,
  status: RequestStatus.pendingApproval,
);
const myRequestsQuery = (scope: RequestScope.mine, status: null);
const departmentRequestsQuery = (scope: RequestScope.approvals, status: null);

/// Request actions. Each returns the updated request and refreshes the lists.
class RequestActions {
  RequestActions(this._ref);

  final Ref _ref;

  RequestsApi get _api => _ref.read(apiProvider).getRequestsApi();

  Future<RequestDto> create(CreateRequestDto dto) =>
      _run(() => _api.requestsControllerCreate(createRequestDto: dto));

  Future<RequestDto> update(String id, UpdateRequestDto dto) =>
      _run(() => _api.requestsControllerUpdate(id: id, updateRequestDto: dto));

  Future<RequestDto> submit(String id) =>
      _run(() => _api.requestsControllerSubmit(id: id));

  Future<RequestDto> approve(String id, String? comment) => _run(
    () => _api.requestsControllerApprove(
      id: id,
      approveDto: ApproveDto(comment: comment),
    ),
  );

  Future<RequestDto> reject(String id, String comment) => _run(
    () => _api.requestsControllerReject(
      id: id,
      rejectDto: RejectDto(comment: comment),
    ),
  );

  Future<RequestDto> cancel(String id, String? reason) => _run(
    () => _api.requestsControllerCancel(
      id: id,
      cancelDto: CancelDto(reason: reason),
    ),
  );

  Future<RequestDto> _run(Future<Response<RequestDto>> Function() call) async {
    final updated = (await call()).data!;
    refreshRequests(_ref, updated.id);
    return updated;
  }
}

/// Invalidates every request list, and one request's detail when given.
void refreshRequests(Ref ref, [String? id]) {
  ref.invalidate(requestsProvider);
  if (id != null) ref.invalidate(requestProvider(id));
}

final requestActionsProvider = Provider<RequestActions>(RequestActions.new);
