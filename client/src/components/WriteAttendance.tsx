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

  console.log('ID---->', ID);
  const writeData = async () => {
    const endpoint =
      'https://fy193h0b8b.execute-api.us-east-1.amazonaws.com/dev/user/attendance';

    const response = await axios.post(endpoint, {
      userId: ID,
    });
  };

  return (
    <div className='mt-5'>
      <button
        className='w-full rounded bg-[#E50914] py-3 font-semibold px-3 text-white'
        onClick={writeData}
        type='submit'
      >
        Write own data to AWS
      </button>
    </div>
  );
};

export default WriteAttendance;
