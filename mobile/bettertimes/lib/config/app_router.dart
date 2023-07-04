import 'package:flutter/material.dart';
import '../screens/screens.dart';
import "package:bettertimes/main.dart";

class AppRouter {
  static Route onGenerateRoute(RouteSettings settings) {
    print('The Route is: ${settings.name}');
    print(settings);
    switch (settings.name) {
      case HomeScreen.routeName:
        return HomeScreen.route();
      case LoginScreen.routeName:
        return LoginScreen.route();
      case SplashScreen.routeName:
        return SplashScreen.route();
      case OnboardingScreen.routeName:
        return OnboardingScreen.route();
      default:
        return _errorRoute();
    }
  }

  static Route _errorRoute() {
    return MaterialPageRoute(
      builder: (_) => Scaffold(appBar: AppBar(title: const Text('error'))),
      settings: RouteSettings(name: '/error'),
    );
  }
}
