import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:prismgo/main.dart';
import 'package:prismgo_api/prismgo_api.dart';

import 'fakes.dart';

Future<FakeSession> pumpApp(WidgetTester tester, {MeDto? signedIn}) async {
  final session = FakeSession(signedIn);
  await tester.pumpWidget(
    ProviderScope(
      overrides: offline(session: session),
      child: const PrismGoApp(),
    ),
  );
  await tester.pumpAndSettle();
  return session;
}

void main() {
  testWidgets('logged-out users land on login and can sign in', (tester) async {
    final session = await pumpApp(tester);
    expect(find.text('Log in'), findsOneWidget);

    await tester.enterText(find.byKey(const Key('phone')), '90000 00005');
    await tester.tap(find.text('Send code'));
    await tester.pumpAndSettle();

    expect(session.requestedPhone, '+919000000005');
    expect(find.text('Test code: 424242'), findsOneWidget);

    await tester.enterText(find.byKey(const Key('code')), '424242');
    await tester.pumpAndSettle();

    expect(session.verifiedCode, '424242');
    expect(find.text('Hello, Rahul'), findsOneWidget);
    expect(find.text('Request a vehicle'), findsOneWidget);
    expect(find.text('Approvals'), findsNothing);
  });

  testWidgets('rejects an invalid number locally', (tester) async {
    final session = await pumpApp(tester);
    await tester.enterText(find.byKey(const Key('phone')), '12345');
    await tester.tap(find.text('Send code'));
    await tester.pumpAndSettle();

    expect(find.text('Enter a valid 10-digit mobile number'), findsOneWidget);
    expect(session.requestedPhone, isNull);
  });

  testWidgets('a restored session opens home; logout returns to login', (
    tester,
  ) async {
    await pumpApp(tester, signedIn: me());
    expect(find.text('Hello, Rahul'), findsOneWidget);
    expect(find.text('API online'), findsOneWidget);

    await tester.tap(find.byTooltip('Log out'));
    await tester.pumpAndSettle();
    expect(find.text('Log in'), findsOneWidget);
  });

  testWidgets('HODs get an Approvals tab; requesters do not', (tester) async {
    await pumpApp(
      tester,
      signedIn: me(roles: const [Role.hod, Role.requester], name: 'Hema'),
    );
    expect(
      find.widgetWithText(NavigationDestination, 'Approvals'),
      findsOneWidget,
    );
    expect(
      find.widgetWithText(NavigationDestination, 'Requests'),
      findsOneWidget,
    );
  });
}
