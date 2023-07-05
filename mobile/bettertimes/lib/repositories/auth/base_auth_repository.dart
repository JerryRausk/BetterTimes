import '../../models/models.dart';

abstract class BaseAuthRepository {
  Stream<User?> get user;
  Future<User?> signUp({
    required String email,
    required String password,
  });
  Future<void> signOut();
}
