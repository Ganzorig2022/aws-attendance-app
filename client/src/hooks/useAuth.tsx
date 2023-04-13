/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { userIdState } from '@/recoil/userIdAtom';
import { useSetRecoilState } from 'recoil';
import { v4 as uuidv4 } from 'uuid';
import checkToken from '@/middleware/checkToken';

//Creating Auth Context
interface AuthType {
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  loggedIn: boolean;
  error: string;
}

const AuthContext = createContext<AuthType>({
  signUp: async () => {},
  signIn: async () => {},
  logout: async () => {},
  loading: false,
  loggedIn: false,
  error: '',
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const setUserId = useSetRecoilState(userIdState);
  const [error, setError] = useState('');

  // keep logged in when refresh
  useEffect(() => {
    const token = Cookies.get('token');

    (async () => {
      const isValidToken = await checkToken(token!);
      if (isValidToken.data.message === 'invalid token') {
        setLoggedIn(false);
        router.push('/auth');
        console.log('<<<<<< USER LOGGED OUT>>>>>>');
      }
      setLoggedIn(true);
      console.log('<<<<<<USER STILL SIGNED IN>>>>>>');
    })();
  }, []);

  // 1) Create user
  const signUp = async (email: string, password: string) => {
    // AWS API gateway URL needs here....
    const endpoint = process.env.NEXT_PUBLIC_AWS_SIGNUP_ENDPOINT!;
    const userId = uuidv4();

    setLoading(true);
    setUserId(userId);
    Cookies.set('userId', userId);

    try {
      const response = await axios.post(endpoint, { email, password, userId });

      if (response.data?.loggedIn) {
        setLoading(false);
        setLoggedIn(true);
        Cookies.set('token', response.data?.token);
        router.push('/');
      }
    } catch (error: any) {
      console.log(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // 2) Login user
  const signIn = async (email: string, password: string) => {
    // AWS API gateway URL needs here....
    const endpoint = process.env.NEXT_PUBLIC_AWS_LOGIN_ENDPOINT!;

    setLoading(true);
    try {
      const response = await axios.post(endpoint, { email, password });

      if (response.data?.loggedIn) {
        setLoading(false);
        setLoggedIn(true);
        Cookies.set('token', response.data?.token);
        Cookies.set('userId', response.data?.userId);
        router.push('/');
      }
    } catch (error: any) {
      console.log(error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  // 3) Log out user
  // const logout = async () => {
  //   localStorage.clear();
  //   Cookies.remove('token');
  //   Cookies.remove('userId');
  //   setLoggedIn(false);
  //   router.push('/auth');
  // };

  const logout = useCallback(async () => {
    localStorage.clear();
    Cookies.remove('token');
    Cookies.remove('userId');
    setLoggedIn(false);
    router.push('/auth');
  }, [router]);

  const memoedValue = useMemo(
    () => ({ signUp, signIn, loading, logout, loggedIn, error }),
    [loading, loggedIn, signIn, logout, error, signUp]
  );

  return (
    <AuthContext.Provider value={memoedValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
