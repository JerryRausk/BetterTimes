import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:flutter/material.dart';

import '../../models/models.dart';
import '../../repositories/repositories.dart';

part 'onboarding_event.dart';
part 'onboarding_state.dart';

class OnboardingBloc extends Bloc<OnboardingEvent, OnboardingState> {
  final UserRepository _userRepository;

  OnboardingBloc({
    required UserRepository userRepository,
  })  : _userRepository = userRepository,
        super(OnboardingLoading()) {
    on<StartOnboarding>(_onStartOnboarding);
    on<ContinueOnboarding>(_onContinueOnboarding);
    on<UpdateUser>(_onUpdateUser);
  }

  void _onStartOnboarding(
    StartOnboarding event,
    Emitter<OnboardingState> emit,
  ) async {
    emit(
      OnboardingLoaded(
        user: User.empty,
        tabController: event.tabController,
      ),
    );
  }

  void _onContinueOnboarding(
    ContinueOnboarding event,
    Emitter<OnboardingState> emit,
  ) async {
    final state = this.state as OnboardingLoaded;
    if (state.user.id == '' && event.user.id != '') {
      emit(
        OnboardingLoaded(
          user: event.user,
          tabController: state.tabController,
        ),
      );
    }
    if (event.isSignup) {
      await _userRepository.createUser(event.user);
    }
    emit(
      OnboardingLoaded(
        user: event.user,
        tabController: state.tabController,
      ),
    );
    if (state.tabController.index < 4) {
      state.tabController.animateTo(state.tabController.index + 1);
    }
  }

  void _onUpdateUser(
    UpdateUser event,
    Emitter<OnboardingState> emit,
  ) {
    // print('den här ' + event.user!.id!);
    if (state is OnboardingLoaded) {
      // print(event.user);
      _userRepository.updateUser(event.user);
      emit(
        OnboardingLoaded(
            user: event.user,
            tabController: (state as OnboardingLoaded).tabController),
      );
    }
  }
}
