import 'package:flutter/material.dart';
import 'package:bettertimes/extensions.dart';

ThemeData theme() {
  return ThemeData(
    primaryColor: '074f57'.toColor(),
    canvasColor: 'f9f8eb'.toColor(),
    cardColor: 'ede9da'.toColor(),
    // primaryColorDark: Color(0xFFFC0028),
    // primaryColorLight: Color(0xFFFE9AAA),
    accentColor: Color(0xFFE84545),
    scaffoldBackgroundColor: Colors.white,
    backgroundColor: Color(0xFFF4F4F4),

    fontFamily: 'Optima',
    textTheme: TextTheme(
      headline1: TextStyle(
        color: Color(0xFF2B2E4A),
        fontWeight: FontWeight.bold,
        fontSize: 36,
      ),
      headline2: TextStyle(
        color: Color(0xFF2B2E4A),
        fontWeight: FontWeight.bold,
        fontSize: 24,
      ),
      headline3: TextStyle(
        color: Color(0xFF2B2E4A),
        fontWeight: FontWeight.bold,
        fontSize: 18,
      ),
      headline4: TextStyle(
        color: Color(0xFF2B2E4A),
        fontWeight: FontWeight.bold,
        fontSize: 16,
      ),
      headline5: TextStyle(
        color: Color(0xFF2B2E4A),
        fontWeight: FontWeight.bold,
        fontSize: 14,
      ),
      headline6: TextStyle(
        color: Color(0xFF2B2E4A),
        fontWeight: FontWeight.normal,
        fontSize: 14,
      ),
      subtitle1: TextStyle(
        color: 'c8bca8'.toColor(),
        fontWeight: FontWeight.normal,
        fontSize: 18,
      ),
      subtitle2: TextStyle(
        color: '#c8bca8'.toColor(),
        fontWeight: FontWeight.normal,
        fontSize: 24,
      ),
      bodyText1: TextStyle(
        color: Color(0xFF2B2E4A),
        fontWeight: FontWeight.normal,
        fontSize: 12,
      ),
      bodyText2: TextStyle(
        color: Color(0xFF2B2E4A),
        fontWeight: FontWeight.normal,
        fontSize: 10,
      ),
    ),
  );
}
