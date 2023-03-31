import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import axios from 'axios';
import { useRecoilState, useRecoilValue } from 'recoil';
import { userIdState } from '@/recoil/userIdAtom';

const GetAttendance = () => {
  const userId = useRecoilValue(userIdState);
  // console.log(userId);

  const writeData = async () => {
    const endpoint =
      'https://qfk9ecqt7i.execute-api.us-east-1.amazonaws.com/dev/user/attendance';
    const response = await axios.get(endpoint);
    console.log(response.data?.data);
  };

  return (
    <div className='mt-5'>
      <button
        className='w-full rounded bg-[#E50914] py-3 font-semibold px-3 text-white'
        onClick={writeData}
        type='submit'
      >
        Get own data from AWS DynamoDB
      </button>
    </div>
  );
};

export default GetAttendance;
