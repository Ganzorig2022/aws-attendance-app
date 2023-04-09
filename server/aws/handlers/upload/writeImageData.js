'use strict';

const { DynamoDB } = require('@aws-sdk/client-dynamodb');
const { marshall } = require('@aws-sdk/util-dynamodb');
const db = new DynamoDB();

// From serverless.yml
const TABLE_NAME = process.env.IMAGES_TABLE; // "Images" will come.
const HASH_KEY = process.env.IMAGE_NAME_HASH_KEY; // "imageName" will come.

module.exports.writeImageData = async (event) => {
  //from s3 event trigger
  const bucketName = event.Records[0].s3.bucket.name; //attendance-image-bucket
  const key = event.Records[0].s3.object.key; // 050a43c9afbe70c61ed0.png

  try {
    const params = {
      bucketName,
      [HASH_KEY]: key, // imageName: '050a43c9afbe70c61ed0.png'
    };

    await db.putItem({
      TableName: TABLE_NAME,
      Item: marshall(params),
      ConditionExpression: 'attribute_not_exists(imageName)', // imageName
    });

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
      },
      body: JSON.stringify({
        message: 'Image table has been successfully created!',
        data: {
          bucketName,
          imageName: key,
        },
      }),
    };
  } catch (error) {
    console.log('ERROR with image table ==>', error);
    return {
      statusCode: 400, //Bad request
      body: JSON.stringify({
        message: 'Bad request.',
      }),
    };
  }
};

// CONSOLE ==>>>>> event.Records[0].s3
// {
//   s3SchemaVersion: '1.0',
//   configurationId: 'aws-attendance-app-dev-compareFaceImage-68a737133cefb25bff959852b8f04754',
//   bucket: {
//     name: 'attendance-image-bucket',
//     ownerIdentity: { principalId: 'A301GJEPAL64YZ' },
//     arn: 'arn:aws:s3:::attendance-image-bucket'
//   },
//   object: {
//     key: '050a43c9afbe70c61ed0.png',
//     size: 358510,
//     eTag: '288b8257f1f185bc7fa52aeafd4f2353',
//     sequencer: '00643150B83641096C'
//   }
// }
