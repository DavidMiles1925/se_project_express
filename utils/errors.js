module.exports.errorHandler = (req, res, err) => {
  const VALIDATION_ERROR = 400;
  const NOTFOUND_ERROR = 404;
  const DEFAULT_ERROR = 500;

  if (err.name === "ValidationError") {
    res
      .status(VALIDATION_ERROR)
      .send({ message: `Validation Error: ${err.message}` });
  } else if (err.name === "DocumentNotFoundError") {
    res
      .status(NOTFOUND_ERROR)
      .send({ message: `Document Not Found: ${err.message}` });
  } else {
    res
      .status(DEFAULT_ERROR)
      .send({ message: `Error: ${err.message} Name: ${err.name}` });
  }
};
