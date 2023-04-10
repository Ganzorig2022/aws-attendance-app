import { atom } from 'recoil';

export interface ImageOpenState {
  view: 'camera' | 'file';
}

const defaultState: ImageOpenState = {
  view: 'camera',
};

export const loginOpenState = atom<ImageOpenState>({
  key: 'imageOpen', // unique ID
  default: defaultState,
});

export type ImageOpenView = 'camera' | 'file';
