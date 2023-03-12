const User = require("../models/user");
const errorHandler = require("../utils/errors");

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      errorHandler.errorHandler(req, res, err);
    });
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.UserId)
    .orFail()
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (req.params.UserId.length !== 24) {
        res.status(400).send({ message: `Invalid ID: ${err.name}` });
      } else {
        errorHandler.errorHandler(req, res, err);
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      errorHandler.errorHandler(req, res, err);
    });
};
