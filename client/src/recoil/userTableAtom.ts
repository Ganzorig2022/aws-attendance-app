import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist();

// 1) Declaring type
export interface userTableType {
  arrivedAt: string;
  createdDate: string;
  lateMinute: string;
  userId: string;
  description: string;
}

// 2) Defining Default State
const defaultState: userTableType[] = [
  {
    arrivedAt: '',
    createdDate: '',
    lateMinute: '',
    userId: '',
    description: '',
  },
];

// 3) Creating global state
export const userTableState = atom({
  key: 'userTable', // unique ID
  default: [] as userTableType[],
  effects_UNSTABLE: [persistAtom],
});
