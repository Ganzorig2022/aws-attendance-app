'use strict';

const { S3 } = require('aws-sdk');

const s3 = new S3();

module.exports.getDailyURL = async (event) => {
  const { userId, bucketName, fileExtension, contentType } = JSON.parse(
    event.body
  ); //from axios.post requst...

  try {
    const params = {
      Bucket: bucketName, // e.g. "user-image"
      Key: `daily/${userId}.${fileExtension}`, // e.g. "daily/7f4a7081b700dfe9bf8c.jpg"
      ContentType: contentType, // e.g. "image.jpg",
      Expires: 3600, // will be expired after 1 hour
    };

    const preSignUrl = s3.getSignedUrl('putObject', params);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
      },
      body: JSON.stringify({
        message: 'Getting pre-sign url is successfull',
        preSignUrl,
      }),
    };
  } catch (error) {
    console.log('<<<<<<Pre-Sign URL ERROR>>>>>', error);

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
