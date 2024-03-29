import axios from 'axios';
import React, { useState } from 'react';
import PreviewImage from './PreviewImage';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import WebcamCapture from './Camera';
import useAxios from '@/hooks/useAxios';
import { useRecoilValue } from 'recoil';
import { userIdState } from '@/recoil/userIdAtom';
import checkImage from '@/middleware/checkImage';
import checkAttendance from '@/middleware/checkAttendance';
import { isImage } from '@/utils/checkFileType';
import checkToken from '@/middleware/checkToken';

const UploadImage = () => {
  const router = useRouter();
  const userId = Cookies.get('userId');
  const token = Cookies.get('token');
  // const userId = useRecoilValue(userIdState);
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

    const fileName = e.target.files[0].name; // "car.jpg" will return

    // 1.1) MIDDLEWARE for check if input file type is image or not...
    const result = isImage(fileName);

    if (!result)
      return toast.error('Please only choose an image with ".png" extension! ');

    // 1.2) If passes above middleware, then proceed below...
    setSelectedFile(e.target.files[0] as any);
    setPreviewImage(URL.createObjectURL(e.target.files[0]));

    const contentType = e.target.files[0].type; // "image/jpg" will return

    setHeaderType(contentType); // "image/jpg"

    setFileData((prev) => ({ ...prev, fileName, contentType }));
  };

  // 2) Upload to AWS S3 - POST request
  const uploadOriginalImage = async () => {
    if (!userId) return toast.error('There is no user id.');

    // 2.1) MIDDLEWARE for checking if token is valid or invalid...
    const isValidToken = await checkToken(token!);

    if (isValidToken.data.message === 'invalid token')
      return toast.error(
        'Invalid token. You are not authorized to upload an image.'
      );

    // 2.2)  If pass all middlewares above, then proceed below operation...
    const { fileName, contentType } = fileData;

    try {
      // AWS endpoint comes here...
      const endpoint = process.env.NEXT_PUBLIC_AWS_GET_ORIGINAL_URL_ENDPOINT!;

      const fileExtension = fileName?.substring(fileName.lastIndexOf('.') + 1); // "jpg" will return

      const body = {
        bucketName,
        userId,
        fileExtension, // "jpg"
        contentType, // "image/jpg"
      };

      const response = await fetchData('post', endpoint, body);

      const preSignUrl = response?.data.preSignUrl;

      if (preSignUrl) {
        // last step for image upload on AWS S3 by using pre-signed URL

        const result = await fetchData('put', preSignUrl, selectedFile, {
          headers: { 'Content-Type': contentType }, // "image/png"
        });

        toast.success('Your image is successfully uploaded!');

        // router.push('/compare');
      }
    } catch (error: any) {
      console.log('<<<<<<ERROR FROM BACKEND>>>>:', error.message);
      toast.error(error.message);
    }
  };

  // 2) Upload to AWS S3 - POST request
  const uploadDailyImage = async () => {
    if (!userId) return toast.error('There is no user id.');

    // 2.1) MIDDLEWARE for checking if there is ORIGINAL or not...
    const response = await checkImage('original', userId);

    if (response?.data.message === 'Image not found') {
      toast.error('Please upload an ORIGINAL image at first!');
      return;
    }

    // 2.2) MIDDLEWARE for checking if user already created attendance table or not...
    const res = await checkAttendance(userId);

    if (res?.data.message === 'Attendance found') {
      toast.error("You already uploaded your today's daily image!");
      return;
    }

    // 2.3) If pass all middlewares above, then proceed below operation...
    const { fileName, contentType } = fileData;

    if (fileName === '' || contentType === '')
      return toast.error('Please choose a file to upload first.');

    if (!selectedFile)
      return toast.error('Please choose a file to upload first.');

    const fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1); // "png" will return

    if (!fileExtension)
      return toast.error('Please choose a file to upload first.');

    try {
      // AWS endpoint comes here...
      const endpoint = process.env.NEXT_PUBLIC_AWS_GET_DAILY_URL_ENDPOINT!;

      const body = {
        userId,
        bucketName,
        fileExtension,
        contentType,
      };

      const response = await fetchData('post', endpoint, body);

      const preSignUrl = response?.data.preSignUrl;

      if (preSignUrl) {
        // last step for image upload on AWS S3 by using pre-signed URL

        const result = await fetchData('put', preSignUrl, selectedFile, {
          headers: { 'Content-Type': contentType }, // "image/png"
        });

        toast.success('Your image is successfully uploaded!');

        router.push('/attendance');
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

  const toggleUploader = (choice: string) => {
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
            toggleUploader('camera');
            setCameraOpen(true);
          }}
        >
          Capture Image by Camera
        </button>
        <button
          className='btn'
          onClick={() => {
            toggleUploader('file');
            setCameraOpen(false);
          }}
        >
          Upload Image File
        </button>
      </div>
      <div className='flex flex-col items-center justify-center space-y-5 mt-10'>
        {imageOpen.file && (
          <input
            type='file'
            className='file-input file-input-bordered file-input-accent w-full max-w-xs '
            onChange={onGetFiles}
            max='6'
            accept='image/*'
            // multiple
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
