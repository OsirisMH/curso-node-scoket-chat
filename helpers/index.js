const dbValidator = require('./db-validators');
const jwtGenerator = require('./jwt-generator');
const googleVerify = require('./google-verify');
const uploadFile = require('./upload-file');

module.exports = {
  ...dbValidator,
  ...jwtGenerator,
  ...googleVerify,
  ...uploadFile,
};
