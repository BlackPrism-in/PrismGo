import 'package:test/test.dart';
import 'package:prismgo_api/prismgo_api.dart';


/// tests for AssignmentsApi
void main() {
  final instance = PrismgoApi().getAssignmentsApi();

  group(AssignmentsApi, () {
    //Future<RequestDto> assignmentsControllerAssign(String id, AssignDto assignDto) async
    test('test assignmentsControllerAssign', () async {
      // TODO
    });

    //Future<AvailabilityDto> assignmentsControllerAvailability(DateTime from, DateTime to, { num passengers }) async
    test('test assignmentsControllerAvailability', () async {
      // TODO
    });

    //Future<RequestDto> assignmentsControllerReassign(String id, ReassignDto reassignDto) async
    test('test assignmentsControllerReassign', () async {
      // TODO
    });

  });
}
