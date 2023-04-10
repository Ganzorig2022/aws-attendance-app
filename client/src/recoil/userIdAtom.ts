import { atom } from 'recoil';

export const userIdState = atom<string>({
  key: 'userId', // unique ID
  default: '',
});
