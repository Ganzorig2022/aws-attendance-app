import Image from 'next/image';
import React from 'react';

type Props = {
  previewImage: string;
  loading: boolean;
  uploadToS3: () => void;
};

const PreviewImage = ({ previewImage, loading, uploadToS3 }: Props) => {
  return (
    <div>
      <div className='card w-80 bg-base-700 shadow-xl border-accent border'>
        <figure>
          <Image
            alt=''
            src={previewImage}
            width={320}
            height={200}
            className='object-cover'
          />
        </figure>
        <div className='card-body'>
          <p>This is your image you've chosen!</p>
          <div className='card-actions justify-end'>
            <button
              className={`btn ${loading ? 'loading' : ''} btn-primary`}
              onClick={uploadToS3}
            >
              UPLOAD
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewImage;
