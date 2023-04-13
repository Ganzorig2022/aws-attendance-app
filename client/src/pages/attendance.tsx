import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { userTableState, userTableType } from '@/recoil/userTableAtom';
import { useRecoilValue } from 'recoil';
import Header from '@/components/Header';
import GetAllAttendance from '@/components/buttons/GetAllAttendance';
import { ToastContainer } from 'react-toastify';

const Attendance = () => {
  const { loggedIn } = useAuth();
  const userTable = useRecoilValue(userTableState);

  if (!loggedIn) return null;

  if (userTable.length === 0)
    return (
      <>
        <Header />
        <div className='flex items-center justify-center text-red-500 text-3xl font-bold'>
          NO USER DATA
        </div>
        <div className='flex flex-col items-center justify-center mt-10'>
          <GetAllAttendance />
          <ToastContainer position='top-center' />
        </div>
      </>
    );

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
                <th>Late Minute</th>
                <th>description</th>
              </tr>
            </thead>
            <tbody className='hover:bg-red-100'>
              {userTable?.map((user: userTableType, i: number) => (
                <tr key={i}>
                  <th>{user.userId}</th>
                  <th>{user.createdDate}</th>
                  <th>{user.lateMinute} min</th>
                  <th>{user.description}</th>
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
