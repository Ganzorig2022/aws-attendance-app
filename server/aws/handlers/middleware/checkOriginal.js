const { DynamoDB } = require('@aws-sdk/client-dynamodb');
const { marshall, unmarshall } = require('@aws-sdk/util-dynamodb');
const db = new DynamoDB();

const TABLE_NAME = process.env.IMAGES_TABLE; // "Images"

module.exports.checkOriginalImage = async (event) => {
  const userId = event.pathParameters.userId; // e.g. "050a43c9afbe70c61ed0.jpg"
  const imageName = `original/${userId}`; // e.g. "original/050a43c9afbe70c61ed0.jpg"

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
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': '*',
        },
        body: JSON.stringify({
          message: 'Data not found',
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
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
      },
      body: JSON.stringify({
        message: 'Data found',
        found: true,
      }),
    };
  } catch (error) {
    console.log('ERROR with image table ==>', error);
    return {
      statusCode: 400, //Bad request
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
      },
      body: JSON.stringify({
        message: 'Bad request.',
      }),
    };
  }
};
