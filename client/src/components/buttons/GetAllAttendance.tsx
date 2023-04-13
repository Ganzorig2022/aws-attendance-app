import React from 'react';
import { useRecoilState } from 'recoil';
import { userTableState } from '@/recoil/userTableAtom';
import useAxios from '@/hooks/useAxios';
import { toast } from 'react-toastify';

const GetAllAttendance = () => {
  const { fetchData, error, loading } = useAxios();
  const [userTable, setUserTable] = useRecoilState(userTableState);

  const getData = async () => {
    const endpoint = process.env.NEXT_PUBLIC_AWS_GET_ALL_ATTENDANCE_ENDPOINT!;

    const response = await fetchData('get', endpoint);

    console.log('DATA', response);

    if (!response?.data.data)
      return toast.error('There is no user attendance data');

    setUserTable(response.data?.data);
  };

  return (
    <div className='mt-5'>
      <button className='btn btn-accent' onClick={getData} type='submit'>
        Get own attendance data
      </button>
    </div>
  );
};

export default GetAllAttendance;
