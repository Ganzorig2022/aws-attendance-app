const { S3 } = require('aws-sdk');

const s3 = new S3();
exports.createS3 = async (event) => {
  const params = {
    Bucket: 'ganzo-s3-bucket',
    Key: 'ganzo.png',
    ContentType: 'image/png',
  };

  const url = s3.getSignedUrl('putObject', params);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'S3',
      url: url,
    }),
  };
};

// POSTMAN dr "Inhertied auth from" songoltoor PUT request yawuulnaa.
