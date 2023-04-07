require('dotenv').config();

const jwt = require('jsonwebtoken');

//get unique token using jsonwebtoken
exports.signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
