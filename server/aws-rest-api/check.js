'use strict';

require('dotenv').config();
const jwt = require('jsonwebtoken');
const uuid = require('uuid');
const { signToken } = require('./utils/signToken');

const USER_ID = uuid.v1();

const token = signToken(USER_ID);

console.log('TOKEN===>', token);

var decoded = jwt.verify(token, process.env.JWT_SECRET);
console.log(decoded.id);
