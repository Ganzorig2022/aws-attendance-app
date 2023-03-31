'use strict';

const { DynamoDB } = require('@aws-sdk/client-dynamodb');
const { unmarshall } = require('@aws-sdk/util-dynamodb');
const db = new DynamoDB();

const TABLE_NAME = process.env.ATTENDANCE_TABLE;

module.exports.getAttendance = async (event) => {
  try {
    const { Items } = await db.scan({
      TableName: TABLE_NAME,
    });

    return {
      statusCode: 200, // OK
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
      },
      body: JSON.stringify({
        data: Items.map((el) => unmarshall(el)),
        message: 'User data arrived successfully.',
      }),
    };
  } catch (error) {
    console.log('ERROR with getting user data ====>', error);
    return {
      statusCode: 400, // Bad request
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

// # https://cloudkatha.com/how-to-create-dynamodb-table-with-global-secondary-index-using-cloudformation/
