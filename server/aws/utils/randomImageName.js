const crypto = require('crypto');

module.exports.randomImageName = (bytes = 16) =>
  crypto.randomBytes(bytes).toString('hex');

// console.log(randomImageName(10)); // 7f4a7081b700dfe9bf8c
