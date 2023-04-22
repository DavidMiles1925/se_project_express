const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    default: "Elise Bouer",
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "You must enter a valid URL.",
    },
    default:
      "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/wtwr-project/Elise.png?etag=0807a449ad64b18fe7cd94781c622e6d",
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return validator.isEmail(value);
      },
      message: "You must enter a valid email address.",
    },
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password
) {
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      console.log("finding one");
      if (!user) {
        console.log("user not found");
        return Promise.reject(new Error("Incorrect email or password"));
      }
      console.log("comparing", user.password);
      return bcrypt.compare(password, user.password).then((matched) => {
        console.log("compared");
        if (!matched) {
          console.log("not matched");
          return Promise.reject(new Error("Incorrect email or password"));
        }
        console.log("user: ", user);
        return user;
      });
    });
};

module.exports = mongoose.model("user", userSchema);

module.exports = mongoose.model("user", userSchema);
