import Header from '@/components/Header';
import { useRouter } from 'next/router';
import React from 'react';

const Compare = () => {
  const router = useRouter();

  //   router.push('/attendance');

  return (
    <div>
      <Header />
    </div>
  );
};

export default Compare;
