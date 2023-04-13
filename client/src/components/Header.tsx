import React from 'react';
import Logout from './auth/Logout';
import { useRecoilValue } from 'recoil';
import { userTableState } from '@/recoil/userTableAtom';

const Header = () => {
  const userTable = useRecoilValue(userTableState);

  return (
    <div className='sticky top-0 z-10'>
      <div className='navbar bg-base-500'>
        <div className='navbar-start'>
          <div className='dropdown'>
            <label tabIndex={0} className='btn btn-ghost lg:hidden'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M4 6h16M4 12h8m-8 6h16'
                />
              </svg>
            </label>
            <ul
              tabIndex={0}
              className='menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52'
            >
              <li>
                <a>Select </a>
              </li>
              <li>
                <a>Item 3</a>
              </li>
            </ul>
          </div>
          <a href='/' className='btn btn-ghost normal-case text-xl '>
            Home
          </a>
          {userTable.length > 0 && (
            <a
              href='/attendance'
              className='btn btn-ghost normal-case text-xl '
            >
              Attendance
            </a>
          )}
        </div>
        <div className='navbar-center hidden lg:flex'></div>
        <div className='navbar-end'>
          <Logout />
        </div>
      </div>
    </div>
  );
};

export default Header;
