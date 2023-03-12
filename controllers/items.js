/* eslint-disable no-underscore-dangle */
const Item = require("../models/item");
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
  Item.findByIdAndRemove(req.params.ItemId)
    .orFail()
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch((err) => {
      errorHandler.errorHandler(req, res, err);
    });
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
