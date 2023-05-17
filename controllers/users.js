const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const errorHandler = require("../utils/errors");
const {
  VALIDATION_OR_CAST_ERROR,
  UNAUTHORIZED__ERROR,
  USER_OK,
  NOT_FOUND_ERROR,
} = require("../utils/errorConstants");
const { JWT_SECRET } = require("../utils/config");

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(USER_OK).send(users))
    .catch((err) => {
      errorHandler.errorHandler(req, res, err);
    });
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.UserId)
    .orFail()
    .then((user) => {
      res.status(USER_OK).send(user);
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
  let { name, avatar } = req.body;
  const { email } = req.body;
  if (!name) {
    name = "New User";
  }
  if (!avatar) {
    avatar =
      "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/wtwr-project/Elise.png?etag=0807a449ad64b18fe7cd94781c622e6d";
  }
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
    .then((user) => {
      const { password: userPassword, ...userWithoutPassword } =
        user.toObject();

      res.send(userWithoutPassword);
    })
    .catch((err) => {
      console.log(err);
      errorHandler.errorHandler(req, res, err);
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      res.status(USER_OK).send({ token });
    })
    .catch((err) => {
      res.status(UNAUTHORIZED__ERROR).send({ message: err.message });
    });
};

module.exports.getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND_ERROR).send({ message: "User not found" });
      } else {
        res.status(USER_OK).send({ data: user });
      }
    })
    .catch((err) => errorHandler.errorHandler(req, res, err));
};

module.exports.updateProfile = async (req, res) => {
  const { name, avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND_ERROR).send({ message: "User not found" });
      } else {
        res.status(USER_OK).send({ data: user });
      }
    })
    .catch((err) => errorHandler.errorHandler(req, res, err));
};
