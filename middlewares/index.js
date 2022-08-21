const fieldsValidator = require('./fields-validator');
const fileValidator   = require('./file-validator');
const JWTValidator    = require('./jwt-validator');
const roleValidator   = require('./role-validator');

module.exports = {
  ...fieldsValidator,
  ...fileValidator,
  ...JWTValidator,
  ...roleValidator,
}