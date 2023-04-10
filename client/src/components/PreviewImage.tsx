import Image from 'next/image';
import React from 'react';

type Props = {
  previewImage: string;
  loading: boolean;
  uploadOriginalImage: () => void;
  uploadDailyImage: () => void;
};

const PreviewImage = ({
  previewImage,
  loading,
  uploadOriginalImage,
  uploadDailyImage,
}: Props) => {
  return (
    <div>
      <div className='card w-[400px] bg-base-700 shadow-xl border-accent border'>
        <figure>
          <Image
            alt='preview'
            src={previewImage}
            width={320}
            height={200}
            className='object-cover'
          />
        </figure>
        <div className='card-body'>
          <p>This is your image you have chosen!</p>
          <div className='flex flex-row space-x-5 items-center justify-center'>
            <button
              className={`btn ${loading ? 'loading' : ''} btn-primary`}
              onClick={uploadOriginalImage}
            >
              Upload original
            </button>
            <button
              className={`btn ${loading ? 'loading' : ''} btn-primary`}
              onClick={uploadDailyImage}
            >
              Upload daily
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewImage;
