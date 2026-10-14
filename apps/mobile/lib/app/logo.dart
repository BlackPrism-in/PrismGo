import 'package:flutter/material.dart';

import 'theme.dart';

/// Wordmark: "Prism" in ink, "Go" in coral (matches the web app).
class Logo extends StatelessWidget {
  const Logo({super.key, this.fontSize = 32});

  final double fontSize;

  @override
  Widget build(BuildContext context) {
    final style = TextStyle(
      fontSize: fontSize,
      fontWeight: FontWeight.w600,
      color: Brand.ink,
      letterSpacing: -0.5,
    );
    return Text.rich(
      TextSpan(
        text: 'Prism',
        style: style,
        children: const [
          TextSpan(
            text: 'Go',
            style: TextStyle(color: Brand.coral),
          ),
        ],
      ),
      textAlign: TextAlign.center,
      semanticsLabel: 'PrismGo',
    );
  }
}
