const {
  VALIDATION_OR_CAST_ERROR,
  NOT_FOUND_ERROR,
  DEFAULT_ERROR,
} = require("./errorConstants");

module.exports.errorHandler = (req, res, err) => {
  if (err.name === "ValidationError") {
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
  } else {
    res.status(DEFAULT_ERROR).send({
      message: `An error has occurred on the sercer: Name: ${err.name}`,
    });
  }
};
