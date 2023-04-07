'use strict';

const { S3Client, ListObjectsV2Command } = require('@aws-sdk/client-s3');
const client = new S3Client({});

const BUCKET_NAME = process.env.BUCKET_NAME; // 'user-image" from serverless.yml

module.exports.getListBucket = async (event) => {
  try {
    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      // The default and maximum number of keys returned is 1000. This limits it to
      // one for demonstration purposes.
      // MaxKeys: 1,
    });

    const { Contents, Name } = await client.send(command);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
      },
      body: JSON.stringify({
        message: 'List Bucket is successful.',
        data: { Contents, Name },
      }),
    };
  } catch (error) {
    console.log('<<<<<<List Bucket ERROR>>>>>', error);
    return {
      statusCode: 400, //Bad request
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
      },
      body: JSON.stringify({
        message: 'Bad request.',
        error: error.message,
      }),
    };
  }
};

// POSTMAN dr "Inhertied auth from" songoltoor PUT request yawuulnaa.
