import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:bettertimes/blocs/blocs.dart';
import '../onboarding/onboarding_screen.dart';
import '/screens/screens.dart';

class SplashScreen extends StatelessWidget {
  static const String routeName = '/splash';

  static Route route() {
    return MaterialPageRoute(
      settings: RouteSettings(name: routeName),
      builder: (context) => SplashScreen(),
    );
  }

  @override
  Widget build(BuildContext context) {
    return WillPopScope(
      onWillPop: () async => false,
      child: BlocListener<AuthBloc, AuthState>(
        listener: (context, state) {
          Timer(
            Duration(seconds: 1),
            () => Navigator.of(context).pushNamedAndRemoveUntil(
              OnboardingScreen.routeName,
              ModalRoute.withName('/onboarding'),
            ),
          );
        },
        child: Scaffold(
          body: Container(
            child: Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  // SvgPicture.asset(
                  //   'assets/logo.svg',
                  //   height: 100,
                  // ),
                  SizedBox(height: 20),
                  Text(
                    'Better Times',
                    style: Theme.of(context).textTheme.headline1,
                  )
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
