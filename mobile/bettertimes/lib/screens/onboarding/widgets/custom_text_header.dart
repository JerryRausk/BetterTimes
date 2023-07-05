import 'package:flutter/material.dart';

class CustomTextHeader extends StatelessWidget {
  final String text;
  final TextStyle? textStyle;

  const CustomTextHeader({
    Key? key,
    required this.text,
    this.textStyle,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Text(
      text,
      style: textStyle != null
          ? textStyle
          : Theme.of(context).textTheme.headline1!.copyWith(
                fontWeight: FontWeight.normal,
              ),
    );
  }
}
