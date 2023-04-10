import Head from 'next/head';
import React from 'react';
import Login from '@/components/auth/Login';
import Signup from '@/components/auth/Signup';
import { useRecoilState } from 'recoil';
import { loginOpenState } from '@/recoil/loginAtom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Auth = () => {
  const [loginOpen, setLoginOpen] = useRecoilState(loginOpenState);

  const toggleView = (view: string) => {
    setLoginOpen({
      ...loginOpen,
      view: view as typeof loginOpen.view,
    });
  };

  return (
    <div className='flex h-screen w-screen flex-col justify-center items-center'>
      <Head>
        <title>Login</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div>
        {/* Login, SignUp page */}
        {loginOpen.view === 'login' && <Login toggleView={toggleView} />}
        {loginOpen.view === 'signup' && <Signup toggleView={toggleView} />}
        <ToastContainer position='top-center' />
      </div>
    </div>
  );
};

export default Auth;
