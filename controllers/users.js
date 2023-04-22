const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const errorHandler = require("../utils/errors");
const {
  VALIDATION_OR_CAST_ERROR,
  AUTHENTICATION_ERROR,
  BAD_REQUEST_ERROR,
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
  const { name, avatar, email } = req.body;

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
      res.status(AUTHENTICATION_ERROR).send({ message: err.message });
    });
};

module.exports.getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND_ERROR).send({ message: "User not found" });
      }

      res.status(USER_OK).send({ data: user });
    })
    .catch((err) => errorHandler(req, res, err));
};

module.exports.updateProfile = (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name", "avatar"];
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
      return res
        .status(BAD_REQUEST_ERROR)
        .send({ message: "Invalid update request" });
    }

    const { userId } = req.user;

    const user = User.findById(userId);
    if (!user) {
      return res.status(NOT_FOUND_ERROR).send({ message: "User not found" });
    }

    updates.forEach((update) => {
      user[update] = req.body[update];
    });

    user.save({ validateBeforeSave: true });

    return res.send({ data: user });
  } catch (err) {
    return errorHandler.errorHandler(req, res, err);
  }
};
