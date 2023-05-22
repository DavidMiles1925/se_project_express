const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {
  VALIDATION_OR_CAST_ERROR,
  USER_OK,
  NOT_FOUND_ERROR,
} = require("../utils/errorConstants");
const { JWT_SECRET = "..." } = process.env;
const BadRequestError = require("../middlewares/badRequestError");
const NotFoundError = require("../middlewares/notFoundError");
const UnauthorizedError = require("../middlewares/unauthorizedError");
const ConflictError = require("../middlewares/conflictError");

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(USER_OK).send(users))
    .catch(() => {
      next(new BadRequestError("Bad Request."));
    });
};

module.exports.getUserById = (req, res, next) => {
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
        next(new NotFoundError("User Not Found."));
      }
    });
};

module.exports.createUser = (req, res, next) => {
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
    .catch(() => {
      next(new ConflictError("Email already in use."));
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      res.status(USER_OK).send({ token });
    })
    .catch(() => {
      next(new UnauthorizedError("Invalid email or password."));
    });
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND_ERROR).send({ message: "User not found" });
      } else {
        res.status(USER_OK).send({ data: user });
      }
    })
    .catch(() => {
      next(new NotFoundError("User not found."));
    });
};

module.exports.updateProfile = async (req, res, next) => {
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
    .catch(() => {
      next(new BadRequestError("Bad Request."));
    });
};
