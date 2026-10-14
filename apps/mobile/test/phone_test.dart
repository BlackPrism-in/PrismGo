import 'package:flutter_test/flutter_test.dart';
import 'package:prismgo/core/phone.dart';

void main() {
  test('normalises common Indian formats', () {
    for (final input in [
      '9812345678',
      '09812345678',
      '919812345678',
      '+91 98123 45678',
      '+91-98123-45678',
    ]) {
      expect(normalizeIndianMobile(input), '+919812345678', reason: input);
    }
  });

  test('rejects invalid numbers', () {
    for (final input in [
      '12345',
      '5812345678',
      '+14155550100',
      '98123456789',
    ]) {
      expect(normalizeIndianMobile(input), isNull, reason: input);
    }
  });

  test('formats for display', () {
    expect(formatIndianMobile('+919812345678'), '+91 98123 45678');
  });
}
