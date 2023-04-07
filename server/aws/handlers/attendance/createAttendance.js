'use strict';

const { DynamoDB } = require('@aws-sdk/client-dynamodb');
const { marshall } = require('@aws-sdk/util-dynamodb');
const { calculateTime } = require('../../utils/calculateTime');
const db = new DynamoDB();

const TABLE_NAME = process.env.ATTENDANCE_TABLE;

module.exports.createAttendance = async (event, context) => {
  let { userId } = JSON.parse(event.body);
  const { subtractedTime, arriveDescription } = await calculateTime();

  // console.log('subtractedTime>>>>>>>>', subtractedTime);
  // console.log('arriveDescription>>>>>>>>', arriveDescription);

  try {
    const params = {
      userId: userId,
      createdAt: Date.now(), // e.g. 1680263701461
      arrivedAt: new Date(Date.now()).toGMTString(), // e.g. 'Fri, 31 Mar 2023 05:40:13 GMT'
      lateMinute: subtractedTime.toFixed(1), // e.g 130.2 etc.
      description: arriveDescription, // eg. Цагтаа ирсэн...
    };

    await db.putItem({
      TableName: TABLE_NAME,
      Item: marshall(params),
    });

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
      },
      body: JSON.stringify({
        message: 'Attendance data has been successfully created!',
      }),
    };
  } catch (error) {
    console.log('ERROR with user create ==>', error);
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
