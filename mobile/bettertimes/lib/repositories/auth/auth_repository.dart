import '../../models/models.dart';
import 'base_auth_repository.dart';

class AuthRepository extends BaseAuthRepository {
  AuthRepository();

  @override
  Future<User?> signUp({
    required String email,
    required String password,
  }) async {
    try {
      return User(username: "eatmeout");
    } catch (_) {}
  }

  Future<void> logInWithEmailAndPassword({
    required String email,
    required String password,
  }) async {
    try {} catch (_) {}
  }

  @override
  Future<void> signOut() async {}

  @override
  Stream<User?> get user => throw UnimplementedError();
}
