import 'dart:async';

import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:bettertimes/blocs/auth/auth_bloc.dart';
import 'package:bettertimes/repositories/repositories.dart';

import '../../models/models.dart';

part 'home_event.dart';
part 'home_state.dart';

class HomeBloc extends Bloc<HomeEvent, HomeState> {
  final AuthBloc _authBloc;
  StreamSubscription? _databaseSubscription;

  HomeBloc({
    required AuthBloc authBloc,
  })  : _authBloc = authBloc,
        super(HomeLoading()) {
    on<LoadHome>(_onLoadHome);
  }

  void _onLoadHome(
    LoadHome event,
    Emitter<HomeState> emit,
  ) {
    emit(HomeLoaded());
  }
}
