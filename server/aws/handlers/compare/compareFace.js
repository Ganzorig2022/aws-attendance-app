'use strict';

const AWS = require('aws-sdk');

const lambda = new AWS.Lambda();

const rekognition = new AWS.Rekognition();

const BUCKET_NAME = process.env.BUCKET_NAME; // 'attendance-image-bucket" from serverless.yml

exports.compareFace = async (event) => {
  const { imageName, bucketName } = event.Records[0].dynamodb.NewImage;
  // imageName --> { S: '9ed3c8bab227db272cbf.png' }
  // bucketName --> { S: 'attendance-image-bucket' }

  const originalPhoto = '9ff1e0004e8814046ebc.jpg';

  try {
    const compareFaceParams = {
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

    const result = await rekognition.compareFaces(compareFaceParams).promise();
    // result will return below
    /*
    {
      SourceImageFace: {
      BoundingBox: {
        Width: 0.3131571114063263,
        Height: 0.4632509648799896,
        Left: 0.3618103563785553,
        Top: 0.18783622980117798
      },
      Confidence: 99.99993896484375
    },
    FaceMatches: [ { Similarity: 99.98960876464844, Face: [Object] } ],
    UnmatchedFaces: [] } */

    const faceSimilarity = result.FaceMatches[0].Similarity; // e.g 99.98960 will return

    if (faceSimilarity > 70) {
      try {
        const arnPrefix = 'arn:aws:lambda:ap-northeast-1:930277727374:function';

        const invokeParams = {
          FunctionName: `${arnPrefix}:aws-attendance-app-dev-createAttendance`,
          InvocationType: 'Event',
          Payload: JSON.stringify({ similarity: 'identical' }),
        };
        await lambda.invoke(invokeParams).promise();

        return {
          statusCode: 200,
          body: JSON.stringify({
            message: 'Result between two faces are IDENTICAL.',
          }),
        };
      } catch (error) {
        console.log('invokeLambda :: Error: ' + error);
      }
    } else {
      console.log('Result between two faces are NOT identical');
    }
  } catch (error) {
    console.log('Error with REKOGNITION>>>>>>>>', error);
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'REKOGNITION FAILED',
      }),
    };
  }
};

// Asia Pacific (Hong Kong)	ap-east-1 region is not available for REKOGNITION service...
// https://docs.aws.amazon.com/general/latest/gr/rekognition.html
//https://docs.aws.amazon.com/rekognition/latest/dg/faces-comparefaces.html
