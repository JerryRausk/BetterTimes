import '../../models/models.dart';
import 'base_user_repository.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

class UserRepository extends BaseUserRepository {
  final FirebaseFirestore _firebaseFirestore = FirebaseFirestore.instance;

  @override
  Future<void> createUser(User user) async {
    await _firebaseFirestore.collection('users').doc(user.id).set(user.toMap());
  }

  @override
  Stream<User> getUser(String userId) {
    return _firebaseFirestore
        .collection('users')
        .doc(userId)
        .snapshots()
        .map((snap) => User.fromSnapshot(snap));
  }

  @override
  Future<User> getUserById(String userId) async {
    var variable =
        await _firebaseFirestore.collection('users').doc(userId).get();
    var user = User.fromSnapshot(variable);
    return user;
  }

  @override
  Future<void> updateUser(User user) async {
    return _firebaseFirestore
        .collection('users')
        .doc(user.id)
        .update(user.toMap())
        .then(
          (value) => print('User document updated.'),
        );
  }
}
