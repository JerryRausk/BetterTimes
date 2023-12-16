import '/models/models.dart';

abstract class BaseUserRepository {
  Future<void> createUser(User user);
  Stream<User> getUser(String userId);
  Future<User> getUserById(String userId);
  Future<void> updateUser(User user);
  // Future<void> deleteUser(String userId);
}
