import { useState, useEffect } from 'react';
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
    // console.log(method, url, body, headers);

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

  //   const getPresignUrl = async (body: any) => {
  //     try {
  //       const res = await axios[method](url, body);
  //       setResponse(res.data);
  //     } catch (error: any) {
  //       setError(error.message);
  //     } finally {
  //       setloading(false);
  //     }
  //   };

  //   return response;

  //   const uploadImage = async (
  //     preSignUrl: string,
  //     imageFile: any,
  //     headerType: string
  //   ) => {
  //     // method => put request
  //     // imageFile ==> e.target.files[0]
  //     try {
  //       const res = await axios[method](url, body);
  //       setResponse(res.data);

  //       await axios.put(preSignUrl, imageFile, {
  //         headers: { 'Content-Type': headerType }, // "image/png"
  //       });
  //     } catch (error: any) {
  //       setError(error.message);
  //     } finally {
  //       setloading(false);
  //     }
  //     return { response, error, loading };
  //   };

  //   return { getPresignUrl, uploadImage };
};

export default useAxios;
