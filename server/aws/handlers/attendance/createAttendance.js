'use strict';

const { DynamoDB } = require('@aws-sdk/client-dynamodb');
const { marshall } = require('@aws-sdk/util-dynamodb');
const { calculateTime } = require('../../utils/calculateTime');
const db = new DynamoDB();

const TABLE_NAME = process.env.ATTENDANCE_TABLE;

module.exports.createAttendance = async (event) => {
  const { similarity, userId } = event; // "identical" will return certainly.

  const { subtractedTime, arriveDescription } = await calculateTime();

  const currentDate = new Date().toJSON().slice(0, 10); // e.g. "2023-04-11"
  const currentHour = new Date().getHours(); // e.g. "11"

  try {
    const params = {
      similarity,
      userId,
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
    console.log('ERROR with attendance data create ==>', error);
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
