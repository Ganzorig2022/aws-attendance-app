import { useState } from 'react';
import axios from 'axios';

type Methods = 'put' | 'post' | 'patch' | 'delete' | 'get';

const useFetch = () => {
  const [error, setError] = useState('');
  const [loading, setloading] = useState(false);

  // url = endpoint irne
  // method = post, get etc.  irne
  // body = data irne

  const fetchAPI = async (
    method: Methods,
    url: string,
    body?: any,
    headers?: any
  ) => {
    try {
      setloading(true);

      const response = await fetch(url, {
        method,
        body,
        mode: 'no-cors',
        headers,
      });

      setloading(false);
      return response.json();
    } catch (error: any) {
      setError(error);
      setloading(false);
    } finally {
      setloading(false);
    }
  };

  return { fetchAPI, error, loading };
};

export default useFetch;
