import 'package:equatable/equatable.dart';

class User extends Equatable {
  final String? id;
  final String username;

  const User({
    this.id,
    required this.username,
  });

  static const User empty = User(
    id: '',
    username: '',
  );
  @override
  List<Object?> get props => [id, username];

  User copyWith({
    String? id,
    String? username,
  }) {
    return User(
      id: id ?? this.id,
      username: username ?? this.username,
    );
  }
}
