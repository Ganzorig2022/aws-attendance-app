import { useState } from 'react';
import axios from 'axios';

type Methods = 'put' | 'post' | 'patch' | 'delete' | 'get';

const useAxios = () => {
  const [error, setError] = useState('');
  const [loading, setloading] = useState(false);

  // url = endpoint irne
  // method = post, get etc.  irne
  // body = data irne

  const fetchData = async (
    method: Methods,
    url: string,
    body?: any,
    headers?: any
  ) => {
    try {
      setloading(true);

      const response = await axios[method](url, body, headers);

      setloading(false);
      return response;
    } catch (error: any) {
      setError(error);
      setloading(false);
    } finally {
      setloading(false);
    }
  };

  return { fetchData, error, loading };
};

export default useAxios;
