import Logout from '@/components/auth/Logout';
import { useAuth } from '@/hooks/useAuth';
import Head from 'next/head';

export default function Home() {
  const { persist } = useAuth();

  if (!persist) return null;

  return (
    <>
      <Head>
        <title>Face recognition App</title>
        <meta name='description' content='Generated by create next app' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div className='flex flex-col items-center justify-center'>
        <h1 className='text-3xl font-bold underline text-red-500'>
          Hello world!
        </h1>
        <Logout />
      </div>
    </>
  );
}
