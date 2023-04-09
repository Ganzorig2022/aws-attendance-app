import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import axios from 'axios';
import { useRecoilValue } from 'recoil';
import { userIdState } from '@/recoil/userIdAtom';
import Cookies from 'js-cookie';

const WriteAttendance = () => {
  const { userId } = useRecoilValue(userIdState);
  const cookieUserId = Cookies.get('userId');
  const ID = userId === '' ? cookieUserId : userId;

  const writeData = async () => {
    const endpoint = process.env.NEXT_PUBLIC_AWS_CREATE_ATTENDANCE_ENDPOINT!;

    const response = await axios.post(endpoint, {
      userId: ID,
    });

    console.log('BACKEND RESPONSE', response);
  };

  return (
    <div className='mt-5 flex items-center justify-center'>
      <button
        className='rounded bg-[#E50914] py-3 font-semibold px-3 text-white'
        onClick={writeData}
        type='submit'
      >
        Write attendance data
      </button>
    </div>
  );
};

export default WriteAttendance;
