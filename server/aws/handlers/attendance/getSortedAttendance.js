'use strict';

const { DynamoDB } = require('@aws-sdk/client-dynamodb');
const { unmarshall, marshall } = require('@aws-sdk/util-dynamodb');
const db = new DynamoDB();

const TABLE_NAME = process.env.ATTENDANCE_TABLE;
const SORT_KEY = 'createdAt';

module.exports.getSortedAttendance = async (event) => {
  const { userId } = JSON.parse(event.body);

  const params = {
    userId,
    username: SORT_KEY,
  };

  try {
    const { Items } = await db.query({
      TableName: TABLE_NAME,
      // Key: marshall(params),
      KeyConditionExpression: 'userId = :userId AND createdAt = :createdAt',
      ExpressionAttributeValues: {
        ':userId': { S: userId },
        ':createdAt': { N: '35' },
      },
      ScanIndexForward: false,
    });

    return {
      statusCode: 200, // OK
      headers: {
        'Access-Control-Allow-Origin': 'http://localhost:3000',
      },
      body: JSON.stringify({
        data: Items,
        message: 'User data arrived successfully.',
      }),
    };
  } catch (error) {
    console.log('ERROR with getting user data ====>', error);
    return {
      statusCode: 400, // Bad request
      headers: {
        'Access-Control-Allow-Origin': 'http://localhost:3000',
      },
      body: JSON.stringify({
        message: 'Bad request.',
      }),
    };
  }
};

// # https://cloudkatha.com/how-to-create-dynamodb-table-with-global-secondary-index-using-cloudformation/
