import '/models/models.dart';

abstract class BaseUserRepository {
  Future<void> createUser(User user);
  Future<User> getUserById(String userId);
  Future<void> updateUser(User user);
}
