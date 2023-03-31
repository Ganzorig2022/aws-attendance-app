'use strict';
require('dotenv').config();

const { DynamoDB } = require('@aws-sdk/client-dynamodb');
const { marshall, unmarshall } = require('@aws-sdk/util-dynamodb');
const bcrypt = require('bcryptjs');
const db = new DynamoDB();

const TABLE_NAME = process.env.ATTENDANCE_TABLE;

module.exports.createAttendance = async (event, context) => {
  let { userId } = JSON.parse(event.body);

  let arriveDescription;

  const lessonStarts = new Date(); //Fri Mar 31 2023 11:17:09 GMT+0800 (Ulaanbaatar Standard Time)

  lessonStarts.setHours(9, 0, 0); //1680224400375
  const currentTime = Date.now();
  const subtractedTime = (currentTime - lessonStarts.getTime()) / 60000; //130 min etc.

  if (subtractedTime > 0 && subtractedTime < 30) {
    arriveDescription = `Та ${subtractedTime} мин хоцорсон байна. Ерөнхийдээ гайгүй байна.`;
  }
  if (subtractedTime < 0) {
    arriveDescription = 'Цагтаа багтаж ирсэн байна.';
  }
  if (subtractedTime > 120) {
    arriveDescription = `За арай арай. Бүхэл бүтэн ${subtractedTime} мин хоцорсон байна штээ.`;
  }

  try {
    const params = {
      userId: userId,
      createdAt: Date.now(),
      description: arriveDescription,
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
