import Header from '@/components/Header';
import WriteAttendance from '@/components/buttons/WriteAttendance';
import { useRouter } from 'next/router';
import React from 'react';

const Compare = () => {
  const router = useRouter();

  return (
    <div>
      <Header />
      <WriteAttendance />
    </div>
  );
};

export default Compare;
