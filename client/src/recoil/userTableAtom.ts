import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist();

// 1) Declaring type
export interface userTableType {
  arrivedAt: { S: string };
  createdAt: { N: number };
  lateMinute: { N: string };
  userId: { S: string };
  description: { S: string };
}

// 2) Defining Default State
const defaultState: userTableType[] = [
  {
    arrivedAt: { S: '' },
    createdAt: { N: 0 },
    lateMinute: { N: '' },
    userId: { S: '' },
    description: { S: '' },
  },
];

// 3) Creating global state
export const userTableState = atom({
  key: 'userTable', // unique ID
  default: [] as userTableType[],
  effects_UNSTABLE: [persistAtom],
});
