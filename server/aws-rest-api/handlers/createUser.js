'use strict';
require('dotenv').config();

const { DynamoDB } = require('@aws-sdk/client-dynamodb');
const { marshall, unmarshall } = require('@aws-sdk/util-dynamodb');
const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');
const { signToken } = require('../utils/signToken');
const db = new DynamoDB();

const TABLE_NAME = process.env.USERS_TABLE; // "Users" irne.
const HASH_KEY = process.env.HASH_KEY; // "userId" irne.

module.exports.createUser = async (event, context) => {
  let { email, password } = JSON.parse(event.body);
  const USER_ID = uuid.v1();

  //create a new token
  const token = signToken(USER_ID);

  try {
    const params = {
      [HASH_KEY]: USER_ID,
      email,
      password: await bcrypt.hash(password, 10),
    };

    await db.putItem({
      TableName: TABLE_NAME,
      Item: marshall(params),
      ConditionExpression: 'attribute_not_exists(userId)',
    });

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
      },
      body: JSON.stringify({
        loggedIn: true,
        token,
        message: 'User has been successfully signed up!',
      }),
    };
  } catch (error) {
    console.log('ERROR with user create ==>', error);
    return {
      statusCode: 400, //Bad request
      body: JSON.stringify({
        loggedIn: false,
        message: 'Bad request.',
      }),
    };
  }
};

// const http = require('http');
// exports.handler = async (event) => {
//     let dataString = '';
//     const token = "...." // <- your JWT token

//     const response = await new Promise((resolve, reject) => {
//         const options = {
//             "headers": {"Authorization": "Bearer " + token}
//         }
//         const req = http.get("url", options, function(res) { [...] }
//     });

//     return response;
// };
