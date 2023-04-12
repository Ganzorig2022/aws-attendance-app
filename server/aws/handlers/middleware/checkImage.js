const { DynamoDB } = require('@aws-sdk/client-dynamodb');
const { marshall } = require('@aws-sdk/util-dynamodb');
const db = new DynamoDB();

const TABLE_NAME = process.env.IMAGES_TABLE; // "Images"

module.exports.checkImage = async (event) => {
  const query = event.pathParameters.query; // e.g. "original-050a43c9afbe70c61ed0.jpg"

  const imageName = query.replace('-', '/'); // e.g. "original/050a43c9afbe70c61ed0.jpg"

  const params = {
    imageName,
  };

  try {
    const result = await db.getItem({
      TableName: TABLE_NAME,
      Key: marshall(params),
    });

    if (!result.Item) {
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': 'http://localhost:3000',
        },
        body: JSON.stringify({
          message: 'Image not found',
          found: false,
        }),
      };
    }

    // Item will return
    /*   {
      bucketName: 'attendance-image-bucket',
      imageName: 'original/b3da3652-f931-4a04-9c2a-edf4f5f13749.jpg'
    } */

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': 'http://localhost:3000',
      },
      body: JSON.stringify({
        message: 'Image found',
        found: true,
      }),
    };
  } catch (error) {
    console.log('ERROR with image table ==>', error);
    return {
      statusCode: 400, //Bad request
      headers: {
        'Access-Control-Allow-Origin': 'http://localhost:3000',
      },
      body: JSON.stringify({
        message: 'Bad request.',
      }),
    };
  }
};
