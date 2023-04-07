const { S3 } = require('aws-sdk');

const s3 = new S3();

module.exports.s3Trigger = async (event) => {
  const bucketName = event.Records[0].s3.bucket.name;
  const key = event.Records[0].s3.object.key;
  console.log('<<<<<<EVENT TRIGGERED>>>>>', event.Records[0].s3);
  console.log('<<<<<<BUCKET NAME>>>>>', bucketName);
  console.log('<<<<<<KEY>>>>>', key);
};
