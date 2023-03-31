import React from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useRecoilState } from 'recoil';
import { userTableState } from '@/recoil/userTableAtom';

const GetOwnAttendance = () => {
  const router = useRouter();
  const [userTable, setUserTable] = useRecoilState(userTableState);

  const getData = async () => {
    const endpoint =
      'https://fy193h0b8b.execute-api.us-east-1.amazonaws.com/dev/user/own-attendance';
    const response = await axios.get(endpoint);
    console.log(response.data?.data);

    if (response.data?.data) {
      setUserTable(response.data?.data);
      router.push('/user');
    }
  };

  return (
    <div className='mt-5'>
      <button
        className='w-full rounded bg-[#E50914] py-3 font-semibold px-3 text-white'
        onClick={getData}
        type='submit'
      >
        Get own data from AWS
      </button>
    </div>
  );
};

export default GetOwnAttendance;
