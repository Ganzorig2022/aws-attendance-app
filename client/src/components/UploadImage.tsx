import axios from 'axios';
import Image from 'next/image';
import React, { useState } from 'react';
import PreviewImage from './PreviewImage';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

const UploadImage = () => {
  const router = useRouter();
  const userId = Cookies.get('userId');

  const [loading, setLoading] = useState(false);
  const [fileData, setFileData] = useState({
    fileName: '',
    contentType: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const [headerType, setHeaderType] = useState('');
  const [imageURLs, setImageURLs] = useState<string[]>([]);
  const [imageName, setImageName] = useState<string[]>([]);
  const [uploadSuccess, setUploadSuccess] = useState(false);

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
  const uploadToS3 = async () => {
    const { fileName, contentType } = fileData;

    setLoading(true);

    try {
      if (fileName === '')
        return alert('Please choose a file to upload first.');

      // AWS endpoint comes here...
      const endpoint = process.env.NEXT_PUBLIC_AWS_PRESIGN_URL_ENDPOINT!;

      const fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1); // "png" will return

      const response = await axios.post(endpoint, {
        bucketName,
        fileExtension,
        contentType,
      });

      const preSignUrl = response.data?.preSignUrl;

      if (preSignUrl) {
        // last step for image upload on AWS S3 by using pre-signed URL
        await axios.put(preSignUrl, selectedFile, {
          headers: { 'Content-Type': headerType }, // "image/png"
        });

        toast.success('Your image is successfully uploaded!');

        router.push('/compare');

        setLoading(false);
      }
    } catch (error: any) {
      console.log('<<<<<<ERROR FROM BACKEND>>>>:', error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
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
      setLoading(false);
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

  return (
    <div>
      <div className='flex flex-col items-center justify-center h-screen space-y-5'>
        <input
          type='file'
          className='file-input file-input-bordered file-input-accent w-full max-w-xs '
          onChange={onGetFiles}
          max='6'
          accept='.jpg,.png,.jpeg'
          multiple
          required
        />

        {previewImage !== '' && (
          <PreviewImage
            previewImage={previewImage}
            loading={loading}
            uploadToS3={uploadToS3}
          />
        )}

        <button
          className={`btn ${loading ? 'loading' : ''} btn-secondary`}
          // disabled
          onClick={getListBuckets}
        >
          GET LIST BUCKETS
        </button>
        {/* <button
      className={`btn ${loading ? 'loading' : ''} btn-error `}
      // disabled
      onClick={deleteImage}
    >
      DELETE SINGLE IMAGE
    </button> */}

        {/* IMAGE CAROUSEL */}
        {/* <Gallery imageURLs={imageURLs} Keys={imageName} /> */}
      </div>
    </div>
  );
};

export default UploadImage;
