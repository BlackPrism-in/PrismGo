import 'package:flutter/material.dart';

/// PrismGo palette. Same rules as the web app (apps/web/src/index.css):
/// ink text on cream/white; coral and mint are fills with ink on top;
/// text in coral uses [coralText] because plain coral on cream is only 2.7:1.
abstract final class Brand {
  static const cream = Color(0xFFFFF6DA);
  static const mint = Color(0xFF84F2D6);
  static const coral = Color(0xFFFC6B3F);
  static const ink = Color(0xFF262525);

  static const coralText = Color(0xFFC93103); // 5.0:1 on cream
  static const coralLight = Color(0xFFFFD9CB);
  static const mintLight = Color(0xFFCFF9EC);
  static const mintText = Color(0xFF0E6B55); // 6.0:1 on cream
  static const sand50 = Color(0xFFFFFBEE);
  static const sand200 = Color(0xFFF0E5C6);
  static const sand300 = Color(0xFFDDD0AE);
  static const sand500 = Color(0xFF736A5E); // 4.9:1 on cream
  static const sand600 = Color(0xFF5C554D);
}

const _scheme = ColorScheme(
  brightness: Brightness.light,
  primary: Brand.coral,
  onPrimary: Brand.ink,
  primaryContainer: Brand.coralLight,
  onPrimaryContainer: Brand.ink,
  secondary: Brand.mint,
  onSecondary: Brand.ink,
  secondaryContainer: Brand.mintLight,
  onSecondaryContainer: Brand.ink,
  tertiary: Brand.ink,
  onTertiary: Brand.cream,
  error: Color(0xFFB3261E),
  onError: Colors.white,
  surface: Brand.cream,
  onSurface: Brand.ink,
  onSurfaceVariant: Brand.sand600,
  surfaceContainerLowest: Colors.white,
  surfaceContainerLow: Brand.sand50,
  surfaceContainer: Brand.sand50,
  surfaceContainerHigh: Brand.sand200,
  surfaceContainerHighest: Brand.sand200,
  outline: Brand.sand500,
  outlineVariant: Brand.sand300,
  inverseSurface: Brand.ink,
  onInverseSurface: Brand.cream,
  inversePrimary: Brand.coral,
);

final appTheme = ThemeData(
  useMaterial3: true,
  colorScheme: _scheme,
  scaffoldBackgroundColor: Brand.cream,
  appBarTheme: const AppBarTheme(
    backgroundColor: Brand.cream,
    foregroundColor: Brand.ink,
    surfaceTintColor: Colors.transparent,
  ),
  cardTheme: const CardThemeData(
    color: Colors.white,
    surfaceTintColor: Colors.transparent,
    elevation: 0,
    shape: RoundedRectangleBorder(
      side: BorderSide(color: Brand.sand200),
      borderRadius: BorderRadius.all(Radius.circular(12)),
    ),
  ),
  textButtonTheme: TextButtonThemeData(
    style: TextButton.styleFrom(foregroundColor: Brand.coralText),
  ),
  inputDecorationTheme: const InputDecorationTheme(
    filled: true,
    fillColor: Colors.white,
    border: OutlineInputBorder(),
    enabledBorder: OutlineInputBorder(
      borderSide: BorderSide(color: Brand.sand500),
    ),
    focusedBorder: OutlineInputBorder(
      borderSide: BorderSide(color: Brand.coralText, width: 2),
    ),
    floatingLabelStyle: TextStyle(color: Brand.coralText),
  ),
  chipTheme: const ChipThemeData(
    backgroundColor: Colors.white,
    side: BorderSide(color: Brand.sand300),
  ),
);
