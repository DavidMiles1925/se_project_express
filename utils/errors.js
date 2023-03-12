module.exports.errorHandler = (req, res, err) => {
  const VALIDATION_OR_CAST_ERROR = 400;
  const NOT_FOUND_ERROR = 404;
  const DEFAULT_ERROR = 500;

  if (err.name === "ValidationError") {
    res
      .status(VALIDATION_OR_CAST_ERROR)
      .send({ message: `Validation Error: ${err.message} Name: ${err.name}` });
  } else if (err.name === "CastError") {
    res
      .status(VALIDATION_OR_CAST_ERROR)
      .send({ message: `Invalid ID Error: ${err.message} Name: ${err.name}` });
  } else if (err.name === "DocumentNotFoundError") {
    res.status(NOT_FOUND_ERROR).send({
      message: `Document Not Found: ${err.message} Name: ${err.name}`,
    });
  } else {
    res
      .status(DEFAULT_ERROR)
      .send({ message: `Error: ${err.message} Name: ${err.name}` });
  }
};
