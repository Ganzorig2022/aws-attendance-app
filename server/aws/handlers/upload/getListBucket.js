'use strict';
// require('dotenv').config();

const { S3Client, ListObjectsV2Command } = require('@aws-sdk/client-s3');
const client = new S3Client({});

const BUCKET_NAME = process.env.BUCKET_NAME; // 'attendance-image-bucket" from serverless.yml

module.exports.getListBucket = async (event) => {
  try {
    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
    });

    const { Contents, Name } = await client.send(command);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': 'http://localhost:3000',
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
        'Access-Control-Allow-Origin': 'http://localhost:3000',
      },
      body: JSON.stringify({
        message: 'Bad request.',
        error: error.message,
      }),
    };
  }
};

// POSTMAN dr "Inhertied auth from" songoltoor PUT request yawuulnaa.
