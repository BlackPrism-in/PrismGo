import 'package:test/test.dart';
import 'package:prismgo_api/prismgo_api.dart';


/// tests for NotificationsApi
void main() {
  final instance = PrismgoApi().getNotificationsApi();

  group(NotificationsApi, () {
    //Future devicesControllerRegister(RegisterDeviceDto registerDeviceDto) async
    test('test devicesControllerRegister', () async {
      // TODO
    });

    //Future devicesControllerUnregister(String token) async
    test('test devicesControllerUnregister', () async {
      // TODO
    });

    //Future<List<NotificationDto>> notificationsControllerList() async
    test('test notificationsControllerList', () async {
      // TODO
    });

    //Future notificationsControllerMarkAllRead() async
    test('test notificationsControllerMarkAllRead', () async {
      // TODO
    });

    //Future notificationsControllerMarkRead(String id) async
    test('test notificationsControllerMarkRead', () async {
      // TODO
    });

    //Future<UnreadCountDto> notificationsControllerUnreadCount() async
    test('test notificationsControllerUnreadCount', () async {
      // TODO
    });

  });
}
