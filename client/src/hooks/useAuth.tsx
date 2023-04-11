/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from 'next/router';
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { userIdState } from '@/recoil/userIdAtom';
import { v4 as uuidv4 } from 'uuid';

//Creating Auth Context
interface AuthType {
  user: User | null;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  loggedIn: boolean;
  persist: boolean;
  error: string;
}

const AuthContext = createContext<AuthType>({
  user: null,
  signUp: async () => {},
  signIn: async () => {},
  logout: async () => {},
  loading: false,
  loggedIn: false,
  persist: false,
  error: '',
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null); //User type from firebase;
  const [loggedIn, setLoggedIn] = useState(false);
  const [persist, setPersist] = useState(false);
  const setUserId = useSetRecoilState(userIdState);
  const [error, setError] = useState('');
  const token = Cookies.get('token');

  useEffect(() => {
    if (token) {
      setPersist(true);
      console.log('<<<<<<USER STILL SIGNED IN>>>>>>');
    }
    if (!token) {
      setPersist(false);
      router.push('/auth');
      console.log('<<<<<< USER LOGGED OUT>>>>>>');
    }
  }, []);

  // 1) Create user
  const signUp = async (email: string, password: string) => {
    // AWS API gateway URL needs here....
    const endpoint = process.env.NEXT_PUBLIC_AWS_SIGNUP_ENDPOINT!;
    const userId = uuidv4();

    setUserId(userId);
    Cookies.set('userId', userId);

    try {
      setLoading(true);

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

  // 2) Sign In user
  const signIn = async (email: string, password: string) => {
    // AWS API gateway URL needs here....
    const endpoint = process.env.NEXT_PUBLIC_AWS_LOGIN_ENDPOINT!;

    try {
      setLoading(true);

      const response = await axios.post(endpoint, { email, password });

      if (response.data?.loggedIn) {
        setLoading(false);
        setLoggedIn(true);
        setPersist(true);
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
  const logout = async () => {
    localStorage.removeItem('recoil-persist');
    Cookies.remove('token');
    Cookies.remove('userId');
    setLoggedIn(false);
    router.push('/auth');
  };

  const memoedValue = useMemo(
    () => ({ user, signUp, signIn, loading, logout, loggedIn, persist, error }),
    [user, loading, loggedIn, signIn, persist, logout, error]
  );

  return (
    <AuthContext.Provider value={memoedValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
