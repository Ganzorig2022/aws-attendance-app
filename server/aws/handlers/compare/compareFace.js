'use strict';

const AWS = require('aws-sdk');

const rekognition = new AWS.Rekognition();

const BUCKET_NAME = process.env.BUCKET_NAME; // 'attendance-image-bucket" from serverless.yml

exports.compareFace = async (event) => {
  const { imageName, bucketName } = event.Records[0].dynamodb.NewImage;
  // imageName --> { S: '9ed3c8bab227db272cbf.png' }
  // bucketName --> { S: 'attendance-image-bucket' }

  const originalPhoto = '0b81619057e56f4ef1a5.jpg';

  try {
    const params = {
      SourceImage: {
        S3Object: {
          Bucket: BUCKET_NAME,
          Name: originalPhoto,
        },
      },
      TargetImage: {
        S3Object: {
          Bucket: BUCKET_NAME,
          Name: imageName.S,
        },
      },
      SimilarityThreshold: 70,
    };

    const result = await rekognition.compareFaces(params).promise();
    console.log('WORKS>>>>>', result);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'REKOG',
        // email: result.TextDetections.filter((email) =>
        //   email.DetectedText.includes('@')
        // )[0].DetectedText,
      }),
    };
  } catch (error) {
    console.log('ERRORRRRRRR', error);
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'REKOG FAILED',
      }),
    };
  }
};

// Asia Pacific (Hong Kong)	ap-east-1 region is not available for REKOGNITION service...
// https://docs.aws.amazon.com/general/latest/gr/rekognition.html
