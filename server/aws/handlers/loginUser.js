'use strict';

const { DynamoDB } = require('@aws-sdk/client-dynamodb');
const bcrypt = require('bcryptjs');
const { signToken } = require('../utils/signToken');
const db = new DynamoDB();

const TABLE_NAME = process.env.USERS_TABLE; // "Users" irne.

module.exports.loginUser = async (event) => {
  let { email, password } = JSON.parse(event.body);
  const GLOBAL_INDEX = email;

  try {
    const result = await db.query({
      TableName: TABLE_NAME,
      IndexName: 'email-index',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': { S: GLOBAL_INDEX },
      },
    });

    // check if data has arrived, then get the password
    if (result.Items.length > 0) {
      const userId = result.Items[0].userId.S;
      const hash = result.Items[0].password.S;
      const isPassword = bcrypt.compareSync(password, hash);
      const token = signToken(userId);

      // if password matches, then OK
      if (isPassword) {
        return {
          statusCode: 200, // OK
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*',
          },
          body: JSON.stringify({
            userId,
            loggedIn: true,
            token,
            message: 'User has logged successfully.',
          }),
        };
      } else {
        // if password DOES NOT match, then error
        return {
          statusCode: 401, // Unauthorized
          body: JSON.stringify({
            loggedIn: false,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Headers': '*',
            },
            message: 'Login, failed. Password does not match!!',
          }),
        };
      }
    } else {
      // if there is no user, then error
      return {
        statusCode: 404, // Not Found
        body: JSON.stringify({
          loggedIn: false,
          message: 'User is not found.',
        }),
      };
    }
  } catch (error) {
    console.log('ERROR with getting user data ====>', error);
    return {
      statusCode: 400, // Bad request
      body: JSON.stringify({
        loggedIn: false,
        message: 'Bad request.',
      }),
    };
  }
};

// # https://cloudkatha.com/how-to-create-dynamodb-table-with-global-secondary-index-using-cloudformation/
