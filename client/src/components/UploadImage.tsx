import axios from 'axios';
import React, { useState } from 'react';
import PreviewImage from './PreviewImage';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import WebcamCapture from './Camera';
import useAxios from '@/hooks/useAxios';

const UploadImage = () => {
  const router = useRouter();
  const userId = Cookies.get('userId');
  const { fetchData, error, loading } = useAxios();
  const [fileData, setFileData] = useState({
    fileName: '',
    contentType: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState(
    'https://datawow.s3.amazonaws.com/blog/43/image_1/facial-recognition-connected-real-estate.png'
  );
  const [headerType, setHeaderType] = useState('');
  const [imageURLs, setImageURLs] = useState<string[]>([]);
  const [imageName, setImageName] = useState<string[]>([]);
  const [imageOpen, setImageOpen] = useState({
    camera: false,
    file: false,
  });
  const [cameraOpen, setCameraOpen] = useState(false);

  const bucketName = process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME!;

  // 1) Get image data from input
  const onGetFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    setSelectedFile(e.target.files[0] as any);
    setPreviewImage(URL.createObjectURL(e.target.files[0]));

    const contentType = e.target.files[0].type; // "image/png" will return

    setHeaderType(contentType); // "image/png"

    const fileName = e.target.files[0].name; // "car.png" will return

    setFileData((prev) => ({ ...prev, fileName, contentType }));
  };

  // 2) Upload to AWS S3 - POST request
  const uploadOriginalImage = async () => {
    const { fileName, contentType } = fileData;

    try {
      // AWS endpoint comes here...
      const endpoint = process.env.NEXT_PUBLIC_AWS_GET_ORIGINAL_URL_ENDPOINT!;

      const fileExtension = fileName?.substring(fileName.lastIndexOf('.') + 1); // "jpg" will return

      const body = {
        bucketName,
        imageName: 'original',
        fileExtension, // "jpg"
        contentType, // "image/png"
      };

      const response = await fetchData('post', endpoint, body);

      const preSignUrl = response?.data.preSignUrl;

      if (preSignUrl) {
        // last step for image upload on AWS S3 by using pre-signed URL

        const result = await fetchData('put', preSignUrl, selectedFile, {
          headers: { 'Content-Type': headerType }, // "image/png"
        });
        console.log('Upload result>>>>>', result?.statusText);
        // await axios.put(preSignUrl, selectedFile, {
        //   headers: { 'Content-Type': headerType }, // "image/png"
        // });

        toast.success('Your image is successfully uploaded!');

        router.push('/compare');
      }
    } catch (error: any) {
      console.log('<<<<<<ERROR FROM BACKEND>>>>:', error.message);
      toast.error(error.message);
    }
  };
  // 2) Upload to AWS S3 - POST request
  const uploadDailyImage = async () => {
    const { fileName, contentType } = fileData;

    try {
      if (fileName === '')
        return alert('Please choose a file to upload first.');

      // AWS endpoint comes here...
      const endpoint = process.env.NEXT_PUBLIC_AWS_GET_DAILY_URL_ENDPOINT!;

      const fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1); // "png" will return

      console.log(fileExtension);
      const body = {
        bucketName,
        fileExtension,
        contentType,
      };

      const response = await fetchData('post', endpoint, body);

      const preSignUrl = response?.data.preSignUrl;

      if (preSignUrl) {
        // last step for image upload on AWS S3 by using pre-signed URL

        const result = await fetchData('put', preSignUrl, selectedFile, {
          headers: { 'Content-Type': headerType }, // "image/png"
        });
        console.log('Upload result>>>>>', result?.statusText);
        // await axios.put(preSignUrl, selectedFile, {
        //   headers: { 'Content-Type': headerType }, // "image/png"
        // });

        toast.success('Your image is successfully uploaded!');

        router.push('/compare');
      }
    } catch (error: any) {
      console.log('<<<<<<ERROR FROM BACKEND>>>>:', error.message);
      toast.error(error.message);
    }
  };

  // 3) Get image's metadata list[] and then get download urls
  const getListBuckets = async () => {
    // AWS endpoint comes here...
    try {
      const endpoint = process.env.NEXT_PUBLIC_AWS_GET_LIST_BUCKETS_ENDPOINT!;

      const response = await axios.get(endpoint);

      console.log('<<<<<<LIST BUCKETS FROM BACKEND>>>>:', response.data?.data);

      const { Contents, Name } = response.data?.data;
      // Contents = [{Key: 'ganzo.png" ...}, {...}] will return
      // Name = 'ganzo-s3-bucket" will return

      console.log('Contents>>>>>>>>>>>>>>>>', Contents);

      const Keys = Contents.map((el: { Key: string }) => el.Key); // ['car.jpg', 'car.png' etc.]

      setImageName([...Keys]); // ['car.jpg', 'car.png' etc.]

      const downloadURLs = Keys.map(
        (key: string) => `https://${Name}.s3.amazonaws.com/${key}`
      );

      setImageURLs([...downloadURLs]);

      // const fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1); // "png" will return
    } catch (error: any) {
      console.log('<<<<<<ERROR FROM BACKEND>>>>:', error.message);
      toast.error(error.message);
    } finally {
      // setLoading(false);
    }
  };

  //   const deleteImage = async () => {
  //     try {
  //       const endpoint = process.env.NEXT_PUBLIC_AWS_DELETE_IMAGE_ENDPOINT!;

  //       const response = await axios.delete(endpoint, {
  //         data: { bucketName, fileName: 'car.png' },
  //       });

  //       console.log('<<<<<<DELETE RESPONSE FROM BACKEND>>>>:', response);
  //     } catch (error: any) {
  //       console.log('<<<<<<ERROR FROM BACKEND>>>>:', error.message);
  //     } finally {
  //     }
  //   };

  const toggle = (choice: string) => {
    if (choice === 'camera')
      setImageOpen((prev) => ({ ...prev, camera: true, file: false }));
    if (choice === 'file')
      setImageOpen((prev) => ({ ...prev, file: true, camera: false }));
  };

  return (
    <div>
      <div className='flex space-x-2'>
        <button
          className='btn'
          onClick={() => {
            toggle('camera');
            setCameraOpen(true);
          }}
        >
          Capture Image by Camera
        </button>
        <button className='btn' onClick={() => toggle('file')}>
          Upload Image File
        </button>
      </div>
      <div className='flex flex-col items-center justify-center h-screen space-y-5'>
        {imageOpen.file && (
          <input
            type='file'
            className='file-input file-input-bordered file-input-accent w-full max-w-xs '
            onChange={onGetFiles}
            max='6'
            accept='.jpg,.png,.jpeg'
            multiple
            required
          />
        )}
        {imageOpen.camera && (
          <WebcamCapture
            setPreviewImage={setPreviewImage}
            setCameraOpen={setCameraOpen}
            cameraOpen={cameraOpen}
            setFileData={setFileData}
            setSelectedFile={setSelectedFile}
          />
        )}

        <PreviewImage
          previewImage={previewImage}
          loading={loading}
          uploadOriginalImage={uploadOriginalImage}
          uploadDailyImage={uploadDailyImage}
        />

        {/* <button
          className={`btn ${loading ? 'loading' : ''} btn-secondary`}
          // disabled
          onClick={getListBuckets}
        >
          GET LIST BUCKETS
        </button> */}
        {/* <button
      className={`btn ${loading ? 'loading' : ''} btn-error `}
      // disabled
      onClick={deleteImage}
    >
      DELETE SINGLE IMAGE
    </button> */}
      </div>
    </div>
  );
};

export default UploadImage;
