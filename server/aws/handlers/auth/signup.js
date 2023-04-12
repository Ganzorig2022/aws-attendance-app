'use strict';

const { DynamoDB } = require('@aws-sdk/client-dynamodb');
const { marshall } = require('@aws-sdk/util-dynamodb');
const bcrypt = require('bcryptjs');
const { signToken } = require('../../utils/signToken');
const db = new DynamoDB();

// From serverless.yml
const TABLE_NAME = process.env.USERS_TABLE; // "Users" irne.
const HASH_KEY = process.env.USER_ID_HASH_KEY; // "userId" irne.

module.exports.signup = async (event, context) => {
  let { email, password, userId } = JSON.parse(event.body);

  //create a new token
  const token = signToken(userId);

  try {
    const params = {
      [HASH_KEY]: userId,
      email,
      password: await bcrypt.hash(password, 10),
    };

    await db.putItem({
      TableName: TABLE_NAME,
      Item: marshall(params),
      ConditionExpression: `attribute_not_exists(${HASH_KEY})`,
    });

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': 'http://localhost:3000',
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

/* Get user input.
Validate user input.
Validate if the user already exists.
Encrypt the user password.
Create a user in our database.
And finally, create a signed JWT token. */
