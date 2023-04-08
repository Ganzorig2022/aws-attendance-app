import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { userTableState, userTableType } from '@/recoil/userTableAtom';
import { useRecoilValue } from 'recoil';
import Header from '@/components/Header';
import { useRouter } from 'next/router';

const Attendance = () => {
  const router = useRouter();
  const { persist } = useAuth();
  const userTable = useRecoilValue(userTableState);

  if (!persist) return null;

  if (userTable.length === 0)
    return (
      <>
        <div className='flex items-center justify-center text-red-500 text-3xl font-bold'>
          NO USER DATA
        </div>
        <button
          className='rounded bg-[#E50914] py-3 font-semibold px-3 text-white'
          onClick={() => router.push('/')}
          type='submit'
        >
          Go to home page
        </button>
      </>
    );

  // console.log(userTable);

  return (
    <>
      <Header />
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
    </>
  );
};

export default Attendance;
