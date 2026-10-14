import 'package:test/test.dart';
import 'package:prismgo_api/prismgo_api.dart';


/// tests for UsersApi
void main() {
  final instance = PrismgoApi().getUsersApi();

  group(UsersApi, () {
    //Future<UserDto> usersControllerCreate(CreateUserDto createUserDto) async
    test('test usersControllerCreate', () async {
      // TODO
    });

    //Future<UserDto> usersControllerGet(String id) async
    test('test usersControllerGet', () async {
      // TODO
    });

    //Future<List<UserDto>> usersControllerList({ Role role, String departmentId, UserStatus status, String q }) async
    test('test usersControllerList', () async {
      // TODO
    });

    //Future<UserDto> usersControllerUpdate(String id, UpdateUserDto updateUserDto) async
    test('test usersControllerUpdate', () async {
      // TODO
    });

  });
}
