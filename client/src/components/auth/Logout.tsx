import { loginOpenState } from '@/recoil/loginAtom';
import React from 'react';
import { useAuth } from '@/hooks/useAuth';

const Logout = () => {
  const { logout } = useAuth();
  return (
    <div className='mt-5'>
      <button
        className='w-full rounded bg-[#E50914] py-3 font-semibold px-3 text-white'
        onClick={logout}
        type='submit'
      >
        Log out
      </button>
    </div>
  );
};

export default Logout;
