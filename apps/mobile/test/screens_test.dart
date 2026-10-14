import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:prismgo/app/theme.dart';
import 'package:prismgo/features/approvals/approvals_screen.dart';
import 'package:prismgo/features/notifications/notifications_screen.dart';
import 'package:prismgo/features/requests/request_detail_screen.dart';
import 'package:prismgo/features/requests/request_form_screen.dart';
import 'package:prismgo_api/prismgo_api.dart';

import 'fakes.dart';

Future<void> pump(
  WidgetTester tester,
  Widget screen,
  List<Override> overrides,
) async {
  await tester.pumpWidget(
    ProviderScope(
      overrides: overrides,
      child: MaterialApp(theme: appTheme, home: screen),
    ),
  );
  await tester.pumpAndSettle();
}

void main() {
  testWidgets('HOD approves from the list', (tester) async {
    late FakeActions fake;
    await pump(
      tester,
      const ApprovalsScreen(),
      offline(
        session: FakeSession(me(roles: const [Role.hod])),
        pending: [
          request(actions: const ['approve', 'reject', 'cancel']),
        ],
        actions: (ref) => fake = FakeActions(ref),
      ),
    );

    expect(find.text('Waiting for you (1)'), findsOneWidget);
    await tester.tap(find.widgetWithText(FilledButton, 'Approve'));
    await tester.pumpAndSettle();
    await tester.enterText(find.byKey(const Key('decision-text')), 'Go ahead');
    await tester.tap(find.widgetWithText(FilledButton, 'Approve').last);
    await tester.pumpAndSettle();

    expect(fake.calls, ['approve:r1:Go ahead']);
  });

  testWidgets('declining needs a reason', (tester) async {
    late FakeActions fake;
    await pump(
      tester,
      const ApprovalsScreen(),
      offline(
        session: FakeSession(me(roles: const [Role.hod])),
        pending: [
          request(actions: const ['approve', 'reject']),
        ],
        actions: (ref) => fake = FakeActions(ref),
      ),
    );

    await tester.tap(find.widgetWithText(OutlinedButton, 'Decline'));
    await tester.pumpAndSettle();
    final decline = find.widgetWithText(FilledButton, 'Decline');
    expect(tester.widget<FilledButton>(decline).onPressed, isNull);

    await tester.enterText(
      find.byKey(const Key('decision-text')),
      'Use the shuttle',
    );
    await tester.pump();
    await tester.tap(decline);
    await tester.pumpAndSettle();
    expect(fake.calls, ['reject:r1:Use the shuttle']);
  });

  testWidgets('detail shows only allowed actions and the driver card', (
    tester,
  ) async {
    final assigned = request(
      status: RequestStatus.assigned,
      actions: const ['cancel'],
      trip: trip(),
    );
    await pump(
      tester,
      const RequestDetailScreen(id: 'r1'),
      offline(session: FakeSession(me()), byId: {'r1': assigned}),
    );

    expect(find.text('Vehicle assigned'), findsOneWidget);
    expect(find.text('KA01AB1001'), findsOneWidget);
    expect(find.text('Suresh Kumar'), findsOneWidget);
    expect(find.widgetWithText(FilledButton, 'Call'), findsOneWidget);
    expect(find.text('Cancel trip'), findsOneWidget);
    expect(find.text('Approve'), findsNothing);
    expect(find.text('Edit'), findsNothing);
  });

  testWidgets('new request form stays disabled until complete', (tester) async {
    await pump(
      tester,
      const RequestFormScreen(),
      offline(session: FakeSession(me())),
    );

    FilledButton submit() => tester.widget<FilledButton>(
      find.widgetWithText(
        FilledButton,
        'Submit for approval',
        skipOffstage: false,
      ),
    );
    expect(submit().onPressed, isNull);

    await tester.enterText(
      find.widgetWithText(TextField, 'Pickup address'),
      'MG Road Office',
    );
    await tester.enterText(
      find.widgetWithText(TextField, 'Pickup coordinates'),
      '12.97, 77.60',
    );
    await tester.enterText(
      find.widgetWithText(TextField, 'Drop address'),
      'Airport',
    );
    await tester.enterText(
      find.widgetWithText(TextField, 'Drop coordinates'),
      'not numbers',
    );
    await tester.pump();
    expect(find.text('Enter as "12.9716, 77.5946"'), findsOneWidget);
    expect(submit().onPressed, isNull);
  });

  testWidgets('alerts list shows unread state', (tester) async {
    await pump(
      tester,
      const NotificationsScreen(),
      offline(
        session: FakeSession(me()),
        notifications: [
          NotificationDto(
            id: 'n1',
            template: 'request_approved',
            title: 'PG-1001 approved',
            body: 'Hema approved the trip.',
            requestId: 'r1',
            createdAt: DateTime.now().subtract(const Duration(minutes: 5)),
          ),
        ],
      ),
    );

    expect(find.text('PG-1001 approved'), findsOneWidget);
    expect(find.text('Mark all read'), findsOneWidget);
    expect(find.byIcon(Icons.circle), findsOneWidget);
  });
}
