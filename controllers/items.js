/* eslint-disable no-underscore-dangle */
const Item = require("../models/item");
const { FORBIDDEN_ERROR, NOT_FOUND_ERROR } = require("../utils/errorConstants");
const errorHandler = require("../utils/errors");

module.exports.getItems = (req, res) => {
  Item.find({})
    .then((items) => {
      res.status(200).send(items);
    })
    .catch((err) => {
      errorHandler.errorHandler(req, res, err);
    });
};

module.exports.createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  Item.create({ name, weather, imageUrl, owner })
    .then((item) => {
      res.status(201).send({ data: item });
    })
    .catch((err) => {
      errorHandler.errorHandler(req, res, err);
    });
};

module.exports.deleteItem = (req, res) => {
  const item = Item.findById(req.params.ItemId);

  if (!item) {
    return res.status(NOT_FOUND_ERROR).send({ message: "Item not found" });
  }

  if (String(item.owner) !== String(req.user.userId)) {
    return res.status(FORBIDDEN_ERROR).send({ message: "Forbidden" });
  }

  return Item.findByIdAndRemove(req.params.ItemId)
    .orFail()
    .then((deletedItem) => res.status(200).send({ data: deletedItem }))
    .catch((err) => errorHandler.errorHandler(req, res, err));
};

module.exports.likeItem = (req, res) => {
  Item.findByIdAndUpdate(
    req.params.ItemId,
    { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
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

module.exports.dislikeItem = (req, res) =>
  Item.findByIdAndUpdate(
    req.params.ItemId,
    { $pull: { likes: req.user._id } }, // remove _id from the array
    { new: true }
  )
    .orFail()
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch((err) => {
      errorHandler.errorHandler(req, res, err);
    });
