import 'package:bettertimes/blocs/auth/auth_bloc.dart';
import 'package:bettertimes/extensions.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class CustomAppBar extends StatelessWidget with PreferredSizeWidget {
  final String title;
  final bool hasActions;
  final bool hasNavigation;

  const CustomAppBar({
    Key? key,
    required this.title,
    required this.hasActions,
    required this.hasNavigation,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<AuthBloc, AuthState>(builder: (context, state) {
      if (state.status == AuthStatus.authenticated) {
        return AppBar(
          backgroundColor: 'f9f8eb'.toColor(),
          elevation: 4,
          leading: hasNavigation ? BackButton(color: Colors.black) : null,
          automaticallyImplyLeading: hasNavigation,
          title: Row(children: [
            // Expanded(
            //   child: SvgPicture.asset(
            //     'assets/logo.svg',
            //     height: 20,
            //   ),
            // ),
            Expanded(
              flex: 2,
              child: Text(
                title,
                style: Theme.of(context).textTheme.headline1,
              ),
            )
          ]),
          actions: hasActions
              ? [
                  IconButton(
                    onPressed: () {
                      Navigator.pushNamed(context, '/route1');
                    },
                    icon: Icon(Icons.people),
                    color: Theme.of(context).primaryColor,
                  ),
                  IconButton(
                    onPressed: () {
                      Navigator.pushNamed(context, '/route2');
                    },
                    icon: Icon(Icons.person),
                    color: Theme.of(context).primaryColor,
                  ),
                ]
              : null,
        );
      } else {
        return AppBar(
          backgroundColor: 'f9f8eb'.toColor(),
          elevation: 0,
          automaticallyImplyLeading: hasNavigation,
          title: Row(children: [
            // Expanded(
            //   child: SvgPicture.asset(
            //     'assets/logo.svg',
            //     height: 20,
            //   ),
            // ),
            Expanded(
              flex: 2,
              child: Text(
                title,
                style: Theme.of(context).textTheme.headline1,
              ),
            )
          ]),
          actions: hasActions
              ? [
                  IconButton(
                    onPressed: () {
                      Navigator.pushNamed(context, '/route1');
                    },
                    icon: Icon(Icons.people),
                    color: Theme.of(context).primaryColor,
                  ),
                  IconButton(
                    onPressed: () {
                      Navigator.pushNamed(context, '/route2');
                    },
                    icon: Icon(Icons.person),
                    color: Theme.of(context).primaryColor,
                  )
                ]
              : null,
        );
      }
    });
  }

  @override
  Size get preferredSize => Size.fromHeight(70.0);
}
