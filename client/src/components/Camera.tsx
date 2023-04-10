import { Dispatch, SetStateAction, useCallback, useRef } from 'react';
import Webcam from 'react-webcam';

const videoConstraints = {
  width: 400,
  height: 400,
  facingMode: 'user',
};

type Props = {
  setPreviewImage: Dispatch<SetStateAction<string>>;
  setCameraOpen: Dispatch<SetStateAction<boolean>>;
  cameraOpen: boolean;
  setFileData: Dispatch<SetStateAction<any>>;
  setSelectedFile: Dispatch<SetStateAction<any>>;
};

const WebcamCapture = ({
  setPreviewImage,
  setCameraOpen,
  cameraOpen,
  setFileData,
  setSelectedFile,
}: Props) => {
  const webcamRef = useRef<Webcam>(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot() as string;

    setPreviewImage(imageSrc);

    fetch(imageSrc as any)
      .then((res) => res.blob)
      .then((blob) => {
        const file = new File([blob as any], 'camera.png', {
          type: 'image/png',
        });
        setSelectedFile(file);
        const { name, type } = file;

        setFileData({ name, contentType: type });
        setCameraOpen(false);
      });
  }, [webcamRef, setPreviewImage]);

  return (
    <div className='relative'>
      {cameraOpen && (
        <>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat='image/jpeg'
            mirrored
            videoConstraints={videoConstraints}
          />
          <button
            className='btn btn-circle btn-outline absolute bottom-5 left-[50%] bg-black'
            onClick={capture}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              stroke-width='1.5'
              stroke='currentColor'
              className='w-6 h-6 text-white'
            >
              <path
                stroke-linecap='round'
                stroke-linejoin='round'
                d='M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z'
              />
              <path
                stroke-linecap='round'
                stroke-linejoin='round'
                d='M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z'
              />
            </svg>
          </button>
        </>
      )}
    </div>
  );
};

export default WebcamCapture;
