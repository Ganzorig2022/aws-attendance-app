require('dotenv').config();
const jwt = require('jsonwebtoken');

module.exports.checkToken = async (event) => {
  const token = event.pathParameters.token; // token
  const secret = process.env.JWT_SECRET;

  try {
    jwt.verify(token, secret);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': 'http://localhost:3000',
      },
      body: JSON.stringify({
        message: 'valid token',
      }),
    };
  } catch (error) {
    console.log('ERROR>>>>>>', error);
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': 'http://localhost:3000',
      },
      body: JSON.stringify({
        message: 'invalid token',
      }),
    };
  }
};

// {
//   id: 'b3b3ec27-a555-4159-85c0-9b6933a40a13',
//   iat: 1681302748,
//   exp: 1681389148
// }
