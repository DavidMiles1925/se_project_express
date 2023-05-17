const { UNAUTHORIZED__ERROR } = require("../utils/errorConstants");

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = UNAUTHORIZED__ERROR;
  }
}

module.exports = UnauthorizedError;
