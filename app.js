const express = require("express");
const mongoose = require("mongoose");

const { PORT = 3001 } = process.env;

const app = express();
const routes = require("./routes");

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(console.log("DB connected"));

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: "640cd2f7567fc057dfdccf1c",
  };
  next();
});
app.use(routes);

app.use((req, res) => {
  res.status(404).send({ message: "Requested resource not found" });
});

app.listen(PORT, () => {
  console.log(`App is listening at port ${PORT}`);
});
