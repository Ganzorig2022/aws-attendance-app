'use strict';

const { DynamoDB } = require('@aws-sdk/client-dynamodb');
const { marshall } = require('@aws-sdk/util-dynamodb');
const { calculateTime } = require('../../utils/calculateTime');
const db = new DynamoDB();

const TABLE_NAME = process.env.ATTENDANCE_TABLE;

// this function will be worked by compareFace function using invoke automatically...
module.exports.createAttendance = async (event) => {
  const { userId } = event;

  const { subtractedTime, arriveDescription } = await calculateTime();

  const createdDate = new Date().toJSON().slice(0, 10); // e.g. "2023-04-11"
  const currentHour = new Date().getHours().toString(); // e.g. "15"
  const currentMin = new Date().getMinutes().toString(); // e.g. "30"
  const arrivedTime = currentHour + ':' + currentMin; // e.g. "15:30"

  const userID = userId.split('.')[0]; // "9ed3c8bab227db272cbf.jpg" ====> "9ed3c8bab227db272cbf"

  try {
    const params = {
      userId: userID,
      createdDate,
      // arrivedTime,
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
        'Access-Control-Allow-Origin': 'http://localhost:3000',
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
        'Access-Control-Allow-Origin': 'http://localhost:3000',
      },
      body: JSON.stringify({
        message: 'Bad request.',
      }),
    };
  }
};
