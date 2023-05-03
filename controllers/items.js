/* eslint-disable no-underscore-dangle */
const Item = require("../models/item");
const {
  FORBIDDEN_ERROR,
  NOT_FOUND_ERROR,
  USER_OK,
} = require("../utils/errorConstants");
const errorHandler = require("../utils/errors");

module.exports.getItems = (req, res) => {
  Item.find({})
    .then((items) => {
      res.status(USER_OK).send(items);
    })
    .catch((err) => {
      errorHandler.errorHandler(req, res, err);
    });
};

module.exports.createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  Item.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      res.status(USER_OK).send({ data: item });
    })
    .catch((err) => {
      errorHandler.errorHandler(req, res, err);
    });
};

module.exports.deleteItem = (req, res) => {
  Item.findById(req.params.ItemId)
    .then((item) => {
      if (!item) {
        return res.status(NOT_FOUND_ERROR).send({ message: "Item not found" });
      }

      if (String(item.owner) !== req.user._id) {
        return res.status(FORBIDDEN_ERROR).send({ message: "Forbidden" });
      }

      return Item.findByIdAndRemove(req.params.ItemId)
        .orFail()
        .then((deletedItem) => res.status(200).send({ data: deletedItem }))
        .catch((err) => errorHandler.errorHandler(req, res, err));
    })
    .catch((err) => errorHandler.errorHandler(req, res, err));
};

module.exports.likeItem = (req, res) => {
  Item.findByIdAndUpdate(
    req.params.ItemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch((err) => {
      errorHandler.errorHandler(req, res, err);
    });
};

module.exports.dislikeItem = (req, res) => {
  Item.findByIdAndUpdate(
    req.params.ItemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch((err) => {
      errorHandler.errorHandler(req, res, err);
    });
};
