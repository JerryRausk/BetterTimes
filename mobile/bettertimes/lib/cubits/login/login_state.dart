part of 'login_cubit.dart';

class LoginState extends Equatable {
  final Email email;
  final Password password;
  final FormzStatus status;
  final String? errorMessage;

  const LoginState({
    this.email = const Email.pure(),
    this.password = const Password.pure(),
    this.status = FormzStatus.pure,
    this.errorMessage,
  });

  factory LoginState.initial() {
    return LoginState(
      email: const Email.pure(),
      password: const Password.pure(),
      status: FormzStatus.pure,
      errorMessage: null,
    );
  }

  @override
  List<Object?> get props => [email, password, status, errorMessage];

  LoginState copyWith({
    Email? email,
    Password? password,
    FormzStatus? status,
    String? errorMessage,
  }) {
    return LoginState(
      email: email ?? this.email,
      password: password ?? this.password,
      status: status ?? this.status,
      errorMessage: errorMessage ?? this.errorMessage,
    );
  }
}
