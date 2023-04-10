import React, { Dispatch, SetStateAction } from 'react';
import Webcam from 'react-webcam';

const videoConstraints = {
  width: 400,
  height: 400,
  facingMode: 'user',
};

type Props = {
  setPreviewImage: Dispatch<SetStateAction<string>>;
};

const WebcamCapture = ({ setPreviewImage }: Props) => {
  const webcamRef = React.useRef<Webcam>(null);

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();

    fetch(imageSrc as any)
      .then((res) => res.blob)
      .then((blob) => {
        const file = new File([blob as any], 'captured.jpg', {
          type: 'image/jpg',
        });
        console.log('WEB', file);
        setPreviewImage(URL.createObjectURL(file));
      });
  }, [webcamRef]);

  return (
    <>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat='image/jpeg'
        mirrored
        videoConstraints={videoConstraints}
      />
      <button className='btn btn-accent' onClick={capture}>
        Capture photo
      </button>
    </>
  );
};

export default WebcamCapture;
