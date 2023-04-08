import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useResetRecoilState } from 'recoil';
import { userTableState } from '@/recoil/userTableAtom';

const Logout = () => {
  const { logout } = useAuth();
  // useResetRecoilState(userTableState);

  return (
    <div className='mt-5'>
      <button
        className='w-full rounded bg-[#E50914] py-3 font-semibold px-3 text-white'
        onClick={() => {
          logout();
          // useResetRecoilState(userTableState);
        }}
        type='submit'
      >
        Log out
      </button>
    </div>
  );
};

export default Logout;
