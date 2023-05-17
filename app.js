const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const { PORT = 3001 } = process.env;

const app = express();

const { errors } = require("celebrate");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const routes = require("./routes");

const errorHandler = require("./middlewares/error-handler");

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(console.log("DB connected"));

app.use(cors());

app.use(express.json());

app.use(requestLogger);
app.use(routes);

app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });
}
