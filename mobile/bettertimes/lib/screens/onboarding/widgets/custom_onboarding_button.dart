import 'package:bettertimes/extensions.dart';
import 'package:flutter/material.dart';

class CustomOnBoardingButton extends StatelessWidget {
  final String text;
  final void Function()? onPressed;

  CustomOnBoardingButton({
    Key? key,
    required this.text,
    this.onPressed,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return DecoratedBox(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(5),
        gradient: LinearGradient(
          colors: [
            'e4c5af'.toColor(),
            '9ece9a'.toColor(),
          ],
        ),
      ),
      child: ElevatedButton(
        onPressed: onPressed,
        style:
            ElevatedButton.styleFrom(primary: Colors.transparent, elevation: 0),
        child: Container(
          width: double.infinity,
          child: Center(
            child: Text(
              text,
              style: Theme.of(context)
                  .textTheme
                  .headline4!
                  .copyWith(color: Colors.white),
            ),
          ),
        ),
      ),
    );
  }
}
