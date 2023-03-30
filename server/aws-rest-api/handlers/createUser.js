'use strict';
require('dotenv').config();

const { DynamoDB } = require('@aws-sdk/client-dynamodb');
const { marshall, unmarshall } = require('@aws-sdk/util-dynamodb');
const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');
const db = new DynamoDB();

const TABLE_NAME = process.env.USERS_TABLE; // "users-table-dev" irne.
const HASH_KEY = process.env.USERS_TABLE; // "users-table-dev" irne.

module.exports.createUser = async (event) => {
  let { email, password } = JSON.parse(event.body);
  const USER_ID = uuid.v1();

  try {
    const params = {
      [HASH_KEY]: USER_ID,
      email,
      password: await bcrypt.hash(password, 10),
    };

    await db.putItem({
      TableName: TABLE_NAME,
      Item: marshall(params),
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        loggedIn: true,
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
