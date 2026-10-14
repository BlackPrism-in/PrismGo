/// Mirrors packages/shared/src/phone.ts so the app validates numbers like the API.
String? normalizeIndianMobile(String input) {
  var digits = input.replaceAll(RegExp(r'[\s\-()]'), '');
  if (digits.startsWith('+91')) {
    digits = digits.substring(3);
  } else if (digits.startsWith('91') && digits.length == 12) {
    digits = digits.substring(2);
  } else if (digits.startsWith('0') && digits.length == 11) {
    digits = digits.substring(1);
  }
  return RegExp(r'^[6-9]\d{9}$').hasMatch(digits) ? '+91$digits' : null;
}

/// "+919812345678" → "+91 98123 45678".
String formatIndianMobile(String e164) {
  final m = RegExp(r'^\+91(\d{5})(\d{5})$').firstMatch(e164);
  return m == null ? e164 : '+91 ${m[1]} ${m[2]}';
}
