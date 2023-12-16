import 'package:equatable/equatable.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

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

  static User fromSnapshot(DocumentSnapshot snap) {
    User user = User(
      id: snap['id'],
      username: snap['username'],
    );

    return user;
  }

  static User fromMap(Map<String, dynamic> map) {
    User user = User(
      id: map['id'],
      username: map['username'],
    );

    return user;
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'username': username,
    };
  }
}
