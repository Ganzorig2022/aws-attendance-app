import React from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useRecoilState } from 'recoil';
import { userTableState } from '@/recoil/userTableAtom';

const GetAllAttendance = () => {
  const router = useRouter();
  const [userTable, setUserTable] = useRecoilState(userTableState);

  const getData = async () => {
    const endpoint = process.env.NEXT_PUBLIC_AWS_GET_ALL_ATTENDANCE_ENDPOINT!;

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

export default GetAllAttendance;
