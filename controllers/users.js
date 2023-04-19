const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const errorHandler = require("../utils/errors");
const { VALIDATION_OR_CAST_ERROR } = require("../utils/errorConstants");
const JWT_SECRET = require("../utils/config");

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
      if (!mongoose.isValidObjectId(req.params.UserId)) {
        res
          .status(VALIDATION_OR_CAST_ERROR)
          .send({ message: `Invalid ID: ${err.message} Name: ${err.name}` });
      } else {
        errorHandler.errorHandler(req, res, err);
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, avatar, email } = req.body;

  User.findOne({ email }).then((user) => {
    if (user) {
      return Promise.reject(new Error("User already exists"));
    }
    return true; // this is probably not right
  });

  bcrypt
    .hash(req.body.password, 10)
    .then((hash) =>
      User.create({
        name,
        avatar,
        email,
        password: hash,
      })
    )
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      errorHandler.errorHandler(req, res, err);
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};
