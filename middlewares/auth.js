const jwt = require("jsonwebtoken");

const { JWT_SECRET = "some-secret-key" } = process.env;
const UnauthorizedError = require("./unauthorizedError");

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return new UnauthorizedError("Authorization required");
  }

  const token = authorization.replace("Bearer ", "");

  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return new UnauthorizedError("Invalid token");
  }

  req.user = payload;
  return next();
};

module.exports = auth;
