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
import { deleteCookie, getCookie, setCookie } from 'cookies-next';

//Creating Auth Context
interface AuthType {
  user: User | null;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
  loading: boolean;
}

const AuthContext = createContext<AuthType>({
  user: null,
  signUp: async () => {},
  signIn: async () => {},
  logout: async () => {},
  error: null,
  loading: false,
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState<User | null>(null); //User type from firebase;
  const [initialLoading, setInitialLoading] = useState(true);

  //Checking the user
  // useEffect(
  //   () =>
  //     onAuthStateChanged(auth, (user) => {
  //       if (user) {
  //         // Logged in...

  //         setUser(user);

  //         setLoading(false);
  //       } else {
  //         // Not logged in...
  //         setUser(null);
  //         setLoading(true);
  //         router.push('/auth');
  //       }

  //       setInitialLoading(false);
  //     }),
  //   [auth]
  // );

  // 1) Create user
  const signUp = async (email: string, password: string) => {
    setLoading(true);

    console.log(email);
    // AWS API gateway URL needs here....
    // await axios.post('/api/posts', { email, password });

    // await createUserWithEmailAndPassword(auth, email, password)
    //   .then((userCredential) => {
    //     setUser(userCredential.user);
    //     // then go to home page
    //     router.push('/');
    //     setLoading(false);
    //   })
    //   .catch((error) => {
    //     alert(error.message);
    //   })
    //   .finally(() => setLoading(false));
  };

  // 2) Sign In user
  const signIn = async (email: string, password: string) => {
    // await signInWithEmailAndPassword(auth, email, password)
    //   .then((userCredential) => {
    //     setUser(userCredential.user);
    //     // then go to home page
    //     router.push('/');
    //     setLoading(false);
    //   })
    //   .catch((error) => {
    //     alert(error.message);
    //   })
    //   .finally(() => setLoading(false));
  };
  // 3) Log out user
  const logout = async () => {
    // setLoading(true);
    // signOut(auth)
    //   .then(() => {
    //     setUser(null);
    //   })
    //   .catch((error) => alert(error.message))
    //   .finally(() => setLoading(false));
  };

  const memoedValue = useMemo(
    () => ({ user, signUp, signIn, error, loading, logout }),
    [user, loading, error]
  );

  return (
    <AuthContext.Provider value={memoedValue}>
      {/* if initialLoading is NULL then... */}
      {/* {!initialLoading && children} */}
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
