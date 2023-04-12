const { DynamoDB } = require('@aws-sdk/client-dynamodb');
const db = new DynamoDB();

const TABLE_NAME = process.env.USERS_TABLE; // "Users" irne.

module.exports.checkSignUpUser = async (event) => {
  const email = event.pathParameters.email; // e.g. "admin@gmail.com"
  const GLOBAL_INDEX = email;

  try {
    const result = await db.query({
      TableName: TABLE_NAME,
      IndexName: 'email-index',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': { S: GLOBAL_INDEX },
      },
    });

    // check if data has arrived, then proceed
    if (result.Items.length > 0) {
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': 'http://localhost:3000',
        },
        body: JSON.stringify({
          message: 'user found',
        }),
      };
    }
    if (result.Items.length === 0) {
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': 'http://localhost:3000',
        },
        body: JSON.stringify({
          message: 'user not found',
        }),
      };
    }
  } catch (error) {
    console.log('ERROR with getting user data ====>', error);
    return {
      statusCode: 400, //Bad request
      body: JSON.stringify({
        loggedIn: false,
        message: 'Bad request.',
      }),
    };
  }
};
