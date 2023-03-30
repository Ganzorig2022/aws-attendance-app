import { useAuth } from '@/hooks/useAuth';
import { LoginView } from '@/recoil/loginAtom';
import Head from 'next/head';
import Image from 'next/image';
import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

type Inputs = {
  email: string;
  password: string;
};

type Props = {
  toggleView: (view: LoginView) => void;
};

const Signup = ({ toggleView }: Props) => {
  //react hook form
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();
  const { signUp, loggedIn, loading } = useAuth();

  const onSubmit: SubmitHandler<Inputs> = async (inputs) => {
    const { email, password } = inputs;

    await signUp(email, password);

    console.log('USER SIGNUP STATUS=====>', loggedIn);
  };

  return (
    <div className='relative flex h-screen w-screen flex-col bg-black md:items-center md:justify-center md:bg-transparent'>
      <Head>
        <title>Sign Up</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      {/* background */}
      <Image
        src='https://datawow.s3.amazonaws.com/blog/43/image_1/facial-recognition-connected-real-estate.png'
        fill
        alt=''
        className='-z-10 !hidden opacity-60 sm:!inline object-cover'
      />

      <form
        className='relative mt-24 space-y-8 rounded bg-black/75 py-10 px-6 md:mt-0 md:max-w-md md:px-14'
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className='text-4xl font-semibold'>Sign Up</h1>
        <div className='space-y-4'>
          <label className='inline-block w-full'>
            <input
              type='email'
              placeholder='Email'
              className={`input ${
                errors.email && 'border-b-2 border-orange-500 '
              }`}
              {...register('email', { required: true })}
            />
            {errors.email && (
              <p className='p-1 text-[13px] font-light  text-orange-500'>
                Please enter a valid email.
              </p>
            )}
          </label>
          <label className='inline-block w-full'>
            <input
              type='password'
              {...register('password', { required: true })}
              placeholder='Password'
              className={`input ${
                errors.password && 'border-b-2 border-orange-500'
              }`}
            />
            {errors.password && (
              <p className='p-1 text-[13px] font-light  text-orange-500'>
                Your password must contain between 4 and 60 characters.
              </p>
            )}
          </label>
        </div>
        <button
          className={`w-full rounded bg-[#E50914] py-3 font-semibold text-white btn hover:bg-red-700 ${
            loading && 'loading'
          }`}
        >
          Sign Up
        </button>
        <div className='flex flex-row items-center justify-center mt-5'>
          <p className='text-[gray]'>Or already signed up?</p>
          <button
            className='cursor-pointer font-semibold hover:underline ml-1 text-red-400'
            onClick={() => toggleView('login')}
            type='submit'
          >
            Login
          </button>
        </div>
      </form>
    </div>
    // <div className='bg-gray-500/75 rounded-lg p-10 '>
    //   <div className='form-control flex flex-col items-center'>
    //     <label className='label'>
    //       <span className='label-text text-black font-bold text-3xl'>
    //         Login
    //       </span>
    //     </label>
    //     <div className='flex flex-col space-y-5 items-center justify-center mt-5'>
    //       <label className='input-group'>
    //         <span>Email </span>
    //         <input
    //           type='text'
    //           placeholder='enter your email'
    //           className='input input-bordered'
    //           name='email'
    //           value={inputs.email}
    //           onChange={onChangeHandler}
    //         />
    //       </label>
    //       <label className='input-group'>
    //         <span>Password</span>
    //         <input
    //           type='text'
    //           placeholder='enter your password'
    //           className='input input-bordered'
    //           name='password'
    //           value={inputs.password}
    //           onChange={onChangeHandler}
    //         />
    //       </label>
    //     </div>
    //     <button className='btn btn-primary mt-5 w-full' onClick={loginHandler}>
    //       Login
    //     </button>
    //   </div>
    // </div>
  );
};

export default Signup;
