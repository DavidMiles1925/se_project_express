const {
  VALIDATION_OR_CAST_ERROR,
  NOT_FOUND_ERROR,
  DEFAULT_ERROR,
  USER_EXISTS_ERROR,
} = require("./errorConstants");

module.exports.errorHandler = (req, res, err) => {
  if (err.name === "ValidationError" || err.name === "ValidatorError") {
    res
      .status(VALIDATION_OR_CAST_ERROR)
      .send({ message: `Validation Error: Name: ${err.name}` });
  } else if (err.name === "CastError") {
    res
      .status(VALIDATION_OR_CAST_ERROR)
      .send({ message: `Invalid ID Error: Name: ${err.name}` });
  } else if (err.name === "DocumentNotFoundError") {
    res.status(NOT_FOUND_ERROR).send({
      message: `Document Not Found: Name: ${err.name}`,
    });
  } else if (err.code === 11000) {
    res.status(USER_EXISTS_ERROR).send({ message: "User already exists" });
  } else {
    console.log("error name: ", err.name);
    res.status(DEFAULT_ERROR).send({
      message: `An error has occurred on the server: Name: ${err.name}`,
    });
  }
};
