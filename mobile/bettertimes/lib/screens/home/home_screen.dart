import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:bettertimes/screens/screens.dart';

import '/blocs/blocs.dart';
import '/widgets/widgets.dart';

class HomeScreen extends StatelessWidget {
  static const String routeName = '/';

  static Route route() {
    return MaterialPageRoute(
        settings: RouteSettings(name: routeName),
        builder: (context) {
          return BlocProvider.of<AuthBloc>(context).state.status ==
                  AuthStatus.unauthenticated
              ? LoginScreen()
              : BlocProvider<HomeBloc>(
                  create: (context) => HomeBloc(
                    authBloc: context.read<AuthBloc>(),
                  ),
                  child: HomeScreen(),
                );
        });
  }

  Widget build(BuildContext context) {
    return BlocBuilder<HomeBloc, HomeState>(
      builder: (context, state) {
        if (state is HomeLoading) {
          return Scaffold(
            appBar: CustomAppBar(
              title: 'HOME',
              hasActions: true,
              hasNavigation: false,
            ),
            body: Center(
              child: CircularProgressIndicator(),
            ),
          );
        }
        if (state is HomeLoaded) {
          return Scaffold(
            appBar: CustomAppBar(
              title: 'HOME',
              hasActions: true,
              hasNavigation: false,
            ),
            body: Center(child: Text("BetterTimes")),
          );
        } else {
          return Scaffold(
            appBar: CustomAppBar(
              title: 'BetterTimes',
              hasActions: true,
              hasNavigation: false,
            ),
            body: Center(
              child: Text('Something went wrong.'),
            ),
          );
        }
      },
    );
  }
}

// class EventsLoadedHomeScreen extends StatelessWidget {
//   const EventsLoadedHomeScreen({
//     Key? key,
//     required this.state,
//   }) : super(key: key);

//   final EventLoaded state;

//   @override
//   Widget build(BuildContext context) {
//     return BlocBuilder<EventscreenBloc, EventscreenState>(
//       builder: (context, state) {},
//     );
//   }
// }
