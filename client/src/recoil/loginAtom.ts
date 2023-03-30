import { atom } from 'recoil';

export interface LoginState {
  view: 'login' | 'signup';
}

const defaultState: LoginState = {
  view: 'login',
};

export const loginOpenState = atom<LoginState>({
  key: 'loginStateId', // unique ID
  default: defaultState,
});

export type LoginView = 'login' | 'signup';
