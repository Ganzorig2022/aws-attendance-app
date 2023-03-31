import { atom } from 'recoil';

// 1) Declaring type
export interface userIdState {
  userId: string;
}

// 2) Defining Default State
const defaultState: userIdState = {
  userId: '',
};

// 3) Creating global state
export const userIdState = atom<userIdState>({
  key: 'userId', // unique ID
  default: defaultState,
});
