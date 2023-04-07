'use strict';

const { DynamoDB } = require('@aws-sdk/client-dynamodb');
const { unmarshall } = require('@aws-sdk/util-dynamodb');
const db = new DynamoDB();

const TABLE_NAME = process.env.ATTENDANCE_TABLE;

module.exports.getOwnAttendance = async (event) => {
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
        data: Items,
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

// https://cloudkatha.com/how-to-create-dynamodb-table-with-global-secondary-index-using-cloudformation/

// https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Query.html
// Query results are always sorted by the sort key value. If the data type of the sort key is Number, the results are returned in numeric order. Otherwise, the results are returned in order of UTF-8 bytes. By default, the sort order is ascending. To reverse the order, set the ScanIndexForward parameter to false.
