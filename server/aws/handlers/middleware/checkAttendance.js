const { DynamoDB } = require('@aws-sdk/client-dynamodb');
const { marshall, unmarshall } = require('@aws-sdk/util-dynamodb');
const db = new DynamoDB();

const TABLE_NAME = process.env.ATTENDANCE_TABLE; // "Attendance" from serverless

module.exports.checkAttendance = async (event) => {
  const userId = event.pathParameters.userId; // e.g. "9ed3c8bab227db272cbf"

  const today = new Date().toJSON().slice(0, 10); // e.g. "2023-04-12"

  const GLOBAL_INDEX = today;

  try {
    const result = await db.query({
      TableName: TABLE_NAME,
      KeyConditionExpression: 'userId = :userId AND createdDate = :createdDate',
      ExpressionAttributeValues: {
        ':userId': { S: userId },
        ':createdDate': { S: GLOBAL_INDEX },
      },
      ScanIndexForward: false,
    });

    // check if data has arrived, then proceed
    if (result.Items.length > 0) {
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': 'http://localhost:3000',
        },
        body: JSON.stringify({
          message: 'Attendance found',
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
          message: 'Attendance not found',
        }),
      };
    }
  } catch (error) {
    console.log('ERROR with getting user data ====>', error);
    return {
      statusCode: 400, //Bad request
      headers: {
        'Access-Control-Allow-Origin': 'http://localhost:3000',
      },
      body: JSON.stringify({
        loggedIn: false,
        message: 'Bad request.',
      }),
    };
  }
};

// IF ITEMS is EMPTY []
/* {
  '$metadata': {
    httpStatusCode: 200,
    requestId: 'DT4GB73AVL6QCMQR5MC5DH8CQJVV4KQNSO5AEMVJF66Q9ASUAAJG',
    extendedRequestId: undefined,
    cfId: undefined,
    attempts: 1,
    totalRetryDelay: 0
  },
  ConsumedCapacity: undefined,
  Count: 0,
  Items: [],
  LastEvaluatedKey: undefined,
  ScannedCount: 0
} */
