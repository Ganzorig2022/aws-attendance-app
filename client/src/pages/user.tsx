import { useAuth } from '@/hooks/useAuth';
import { userTableState, userTableType } from '@/recoil/userTableAtom';
import React from 'react';
import { useRecoilValue } from 'recoil';

const User = () => {
  const { persist } = useAuth();
  const userTable = useRecoilValue(userTableState);
  console.log('RECOIL=======>>>>>', userTable);

  if (!persist) return null;

  if (userTable.length === 0)
    return (
      <div className='flex items-center justify-center text-red-500 text-3xl font-bold'>
        NO USER DATA
      </div>
    );

  return (
    <div className='m-10'>
      <div className='overflow-x-auto'>
        <div className='flex items-center justify-center text-red-500 text-3xl font-bold mb-5'>
          USER ATTENDANCE DATA
        </div>
        <table className='table table-compact w-full'>
          <thead>
            <tr>
              <th>ID</th>
              <th>Created at</th>
              <th>Arrived time</th>
              <th>description</th>
              <th>Late Minute</th>
            </tr>
          </thead>
          <tbody className='hover:bg-red-100'>
            {userTable.map((user: userTableType, i: number) => (
              <tr key={i}>
                <th>{user.userId.S}</th>
                <th>{user.createdAt.N}</th>
                <th>{user.arrivedAt.S}</th>
                <th>{user.lateMinute.N} min</th>
                <th>{user.description.S}</th>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default User;
