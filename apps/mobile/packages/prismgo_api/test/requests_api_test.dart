import 'package:test/test.dart';
import 'package:prismgo_api/prismgo_api.dart';


/// tests for RequestsApi
void main() {
  final instance = PrismgoApi().getRequestsApi();

  group(RequestsApi, () {
    //Future<RequestDto> requestsControllerApprove(String id, ApproveDto approveDto) async
    test('test requestsControllerApprove', () async {
      // TODO
    });

    //Future<RequestDto> requestsControllerCancel(String id, CancelDto cancelDto) async
    test('test requestsControllerCancel', () async {
      // TODO
    });

    //Future<RequestDto> requestsControllerCreate(CreateRequestDto createRequestDto) async
    test('test requestsControllerCreate', () async {
      // TODO
    });

    //Future<RequestDto> requestsControllerGet(String id) async
    test('test requestsControllerGet', () async {
      // TODO
    });

    //Future<List<RequestDto>> requestsControllerList({ RequestScope scope, RequestStatus status }) async
    test('test requestsControllerList', () async {
      // TODO
    });

    //Future<RequestDto> requestsControllerReject(String id, RejectDto rejectDto) async
    test('test requestsControllerReject', () async {
      // TODO
    });

    //Future<RequestDto> requestsControllerSubmit(String id) async
    test('test requestsControllerSubmit', () async {
      // TODO
    });

    //Future<RequestDto> requestsControllerUpdate(String id, UpdateRequestDto updateRequestDto) async
    test('test requestsControllerUpdate', () async {
      // TODO
    });

  });
}
