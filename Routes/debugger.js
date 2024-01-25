const dbBefore = require("debug")("db:before");
const dbAfter = require("debug")("db:after");
const mongoDbError = require("debug")("error:mongodb");

module.exports = {
  dbBefore,
  dbAfter,
  mongoDbError,
};
