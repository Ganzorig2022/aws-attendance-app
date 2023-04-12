'use strict';

const { S3Client, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const client = new S3Client({});

module.exports.deleteImage = async (event) => {
  const { bucketName, fileName } = JSON.parse(event.body);

  try {
    const command = new DeleteObjectCommand({
      Bucket: bucketName, // "user-image"
      Key: fileName, // e.g. "my-image.jpg"
    });

    await client.send(command);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': 'http://localhost:3000',
      },
      body: JSON.stringify({
        message: 'Image Deletion is successful.',
      }),
    };
  } catch (error) {
    console.log('<<<<<<Image DELETE ERROR>>>>>', error);
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
