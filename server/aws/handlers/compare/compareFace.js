'use strict';

const AWS = require('aws-sdk');

const lambda = new AWS.Lambda();

const rekognition = new AWS.Rekognition();

// from serverless.yml
const BUCKET_NAME = process.env.BUCKET_NAME; // 'attendance-image-bucket"
const REGION = process.env.REGION; // 'us-east-1"

AWS.config.update({ region: REGION });

exports.compareFace = async (event) => {
  let imageName = null;

  const newImage = event.Records[0].dynamodb.NewImage;

  if (newImage) {
    imageName = event.Records[0].dynamodb.NewImage.imageName; // imageName --> { S: 'daily/9ed3c8bab227db272cbf.jpg' }
  }

  if (!newImage) {
    imageName = event.Records[0].dynamodb.OldImage.imageName; // imageName --> { S: 'daily/9ed3c8bab227db272cbf.jpg' }
  }

  const userId = imageName.S.split('/')[1]; // "daily/9ed3c8bab227db272cbf.jpg" ====> "9ed3c8bab227db272cbf.jpg"

  const originalImage = `original/${userId}`; // "original/9ed3c8bab227db272cbf.jpg"
  const dailyImage = `daily/${userId}`; // "daily/9ed3c8bab227db272cbf.jpg"

  try {
    const compareFaceParams = {
      SourceImage: {
        S3Object: {
          Bucket: BUCKET_NAME,
          Name: originalImage,
        },
      },
      TargetImage: {
        S3Object: {
          Bucket: BUCKET_NAME,
          Name: dailyImage,
        },
      },
      SimilarityThreshold: 70,
    };

    const result = await rekognition.compareFaces(compareFaceParams).promise();
    // result will return below if face matches
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

    if (!result.FaceMatches) {
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': '*',
        },
        body: JSON.stringify({
          message: 'Result between two faces are NOT IDENTICAL.',
        }),
      };
    }

    // const matchFound = result.FaceMatches[0]; // e.g 99.98960 will return

    try {
      const arnPrefix = 'arn:aws:lambda:us-east-1:930277727374:function';

      const invokeParams = {
        FunctionName: `${arnPrefix}:aws-attendance-app-dev-createAttendance`,
        InvocationType: 'Event',
        Payload: JSON.stringify({ similarity: 'identical', userId }),
      };
      await lambda.invoke(invokeParams).promise();

      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': '*',
        },
        body: JSON.stringify({
          message: 'Result between two faces are IDENTICAL.',
        }),
      };
    } catch (error) {
      console.log('invokeLambda :: Error: ' + error);
    }
  } catch (error) {
    console.log('Error with REKOGNITION>>>>>>>>', error);
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
      },
      body: JSON.stringify({
        message: 'REKOGNITION FAILED',
      }),
    };
  }
};

// Asia Pacific (Hong Kong)	ap-east-1 region is not available for REKOGNITION service...
// https://docs.aws.amazon.com/general/latest/gr/rekognition.html
//https://docs.aws.amazon.com/rekognition/latest/dg/faces-comparefaces.html

// event.Records[0] RETURN RESULT...................
/* {
  eventID: '55f005a29af763d491ef3e4325575b67',
  eventName: 'INSERT',
  eventVersion: '1.1',
  eventSource: 'aws:dynamodb',
  awsRegion: 'us-east-1',
  dynamodb: {
    ApproximateCreationDateTime: 1681208071,
    Keys: { imageName: [Object] },
    NewImage: { bucketName: [Object], imageName: [Object] },
    SequenceNumber: '100000000037511569521',
    SizeBytes: 149,
    StreamViewType: 'NEW_AND_OLD_IMAGES'
  },
  eventSourceARN: 'arn:aws:dynamodb:us-east-1:930277727374:table/Images/stream/2023-04-11T10:12:15.429'
} */

// // event.Records[0].dynamodb RETURN RESULT...................

/* {
  ApproximateCreationDateTime: 1681219564,
  Keys: {
    imageName: { S: 'original/a67ec4dc-6270-45c1-8215-10acc5466d3e.jpg' }
  },
  NewImage: {
    bucketName: { S: 'attendance-image-bucket' },
    imageName: { S: 'original/a67ec4dc-6270-45c1-8215-10acc5466d3e.jpg' }
  },
  SequenceNumber: '100000000039628750228',
  SizeBytes: 149,
  StreamViewType: 'NEW_AND_OLD_IMAGES'
} */
