/* eslint-disable no-underscore-dangle */
const Item = require("../models/item");
const { USER_OK } = require("../utils/errorConstants");
const NotFoundError = require("../middlewares/notFoundError");
const ConflictError = require("../middlewares/conflictError");
const ForbiddenError = require("../middlewares/forbiddenError");
const BadRequestError = require("../middlewares/badRequestError");

module.exports.getItems = (req, res, next) => {
  Item.find({})
    .then((items) => {
      res.status(USER_OK).send(items);
    })
    .catch(() => {
      next(new NotFoundError("Items not found."));
    });
};

module.exports.createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;

  Item.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      res.status(USER_OK).send({ data: item });
    })
    .catch(() => {
      next(new ConflictError("Conflict."));
    });
};

module.exports.deleteItem = (req, res, next) => {
  Item.findById(req.params.ItemId)
    .then((item) => {
      if (!item) {
        return new NotFoundError("Item was not found");
      }

      if (String(item.owner) !== req.user._id) {
        return new ForbiddenError("Not authorized.");
      }

      return Item.findByIdAndRemove(req.params.ItemId)
        .orFail()
        .then((deletedItem) => res.status(USER_OK).send({ data: deletedItem }))
        .catch(() => {
          next(new NotFoundError("Items not found."));
        });
    })
    .catch(() => {
      next(new BadRequestError("Bad Request."));
    });
};

module.exports.likeItem = (req, res, next) => {
  Item.findByIdAndUpdate(
    req.params.ItemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => {
      res.status(USER_OK).send({ data: item });
    })
    .catch(() => {
      next(new BadRequestError("Bad Request."));
    });
};

module.exports.dislikeItem = (req, res, next) => {
  Item.findByIdAndUpdate(
    req.params.ItemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => {
      res.status(USER_OK).send({ data: item });
    })
    .catch(() => {
      next(new BadRequestError("Bad Request."));
    });
};
