const jwt = require("jsonwebtoken");
const config = require("../utils/config");
const { AUTHORIZATION_ERROR } = require("../utils/errorConstants");

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(AUTHORIZATION_ERROR)
      .send({ message: "Authorization required" });
  }

  const token = authorization.replace("Bearer ", "");

  let payload;
  try {
    payload = jwt.verify(token, config.JWT_SECRET);
  } catch (err) {
    return res.status(AUTHORIZATION_ERROR).send({ message: "Invalid token" });
  }

  req.user = payload;
  return next();
};

module.exports = auth;
