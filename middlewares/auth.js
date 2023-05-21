const jwt = require("jsonwebtoken");
const { UNAUTHORIZED__ERROR } = require("../utils/errorConstants");

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(UNAUTHORIZED__ERROR)
      .send({ message: "Authorization required" });
  }

  const token = authorization.replace("Bearer ", "");

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(UNAUTHORIZED__ERROR).send({ message: "Invalid token" });
  }

  req.user = payload;
  return next();
};

module.exports = auth;
