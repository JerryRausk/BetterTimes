import 'package:bettertimes/screens/screens.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../blocs/blocs.dart';
import '../widgets/onboarding_widgets.dart';

class StartTab extends StatelessWidget {
  const StartTab({
    Key? key,
    required this.state,
  }) : super(key: key);

  final OnboardingLoaded state;

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Column(
          children: [
            Container(
              height: 200,
              width: 200,
            ),
            SizedBox(height: 20),
            Text(
              'Welcome to Bettertimes',
              style: Theme.of(context).textTheme.headline2,
            ),
            SizedBox(height: 20),
          ],
        ),
        CustomOnBoardingButton(
          text: 'START',
          onPressed: () {
            context
                .read<OnboardingBloc>()
                .add(ContinueOnboarding(user: state.user));
          },
        ),
        CustomOnBoardingButton(
          text: 'LOGIN',
          onPressed: () {
            Navigator.of(context).pushNamedAndRemoveUntil(
                LoginScreen.routeName, ModalRoute.withName('/login'));
          },
        )
      ],
    );
  }
}
