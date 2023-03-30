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
import { deleteCookie, getCookie, setCookie, hasCookie } from 'cookies-next';

//Creating Auth Context
interface AuthType {
  user: User | null;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  loggedIn: boolean;
  persist: boolean;
}

const AuthContext = createContext<AuthType>({
  user: null,
  signUp: async () => {},
  signIn: async () => {},
  logout: async () => {},
  loading: false,
  loggedIn: false,
  persist: false,
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null); //User type from firebase;
  const [loggedIn, setLoggedIn] = useState(false);
  const [persist, setPersist] = useState(hasCookie('token'));

  //Check the user's TOKEN
  useEffect(() => {
    if (!persist) {
      setLoggedIn(false);
      router.push('/auth');
      console.log('<<<<<< USER LOGGED OUT>>>>>>');
    }
    if (persist) {
      setLoggedIn(true);
      console.log('<<<<<<USER STILL SIGNED IN>>>>>>');
    }
  }, [persist]);

  // 1) Create user
  const signUp = async (email: string, password: string) => {
    // AWS API gateway URL needs here....
    const endpoint =
      'https://6ofxmxo37f.execute-api.us-east-1.amazonaws.com/dev/user/signup';

    //POST - https://6ofxmxo37f.execute-api.us-east-1.amazonaws.com/dev/user/signup
    //POST - https://6ofxmxo37f.execute-api.us-east-1.amazonaws.com/dev/user/login

    try {
      setLoading(true);

      const response = await axios.post(endpoint, { email, password });

      if (response.data?.loggedIn) {
        setLoading(false);
        setLoggedIn(true);
        setCookie('token', response.data?.token);
        router.push('/');
      }
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  // 2) Sign In user
  const signIn = async (email: string, password: string) => {
    // AWS API gateway URL needs here....
    const endpoint =
      'https://6ofxmxo37f.execute-api.us-east-1.amazonaws.com/dev/user/login';

    try {
      setLoading(true);

      const response = await axios.post(endpoint, { email, password });

      if (response.data?.loggedIn) {
        setLoading(false);
        setLoggedIn(true);
        setPersist(true);
        setCookie('token', response.data?.token);
        router.push('/');
      }
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };
  // 3) Log out user
  const logout = async () => {
    deleteCookie('token');
    setLoggedIn(false);
    router.push('/auth');
  };

  const memoedValue = useMemo(
    () => ({ user, signUp, signIn, loading, logout, loggedIn, persist }),
    [user, loading]
  );

  return (
    <AuthContext.Provider value={memoedValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
