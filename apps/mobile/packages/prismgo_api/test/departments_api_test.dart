import 'package:test/test.dart';
import 'package:prismgo_api/prismgo_api.dart';


/// tests for DepartmentsApi
void main() {
  final instance = PrismgoApi().getDepartmentsApi();

  group(DepartmentsApi, () {
    //Future<DepartmentDto> departmentsControllerCreate(CreateDepartmentDto createDepartmentDto) async
    test('test departmentsControllerCreate', () async {
      // TODO
    });

    //Future<List<DepartmentDto>> departmentsControllerList() async
    test('test departmentsControllerList', () async {
      // TODO
    });

    //Future<DepartmentDto> departmentsControllerUpdate(String id, UpdateDepartmentDto updateDepartmentDto) async
    test('test departmentsControllerUpdate', () async {
      // TODO
    });

  });
}
