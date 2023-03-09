const Item = require("../models/item");

module.exports.getItems = (req, res) => {
  Item.find({})
    .then((items) => {
      res.send({ data: items });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

module.exports.createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  Item.create({ name, weather, imageUrl })
    .then((item) => {
      res.send({ data: item });
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.deleteItem = (req, res) => {
  Item.findByIdAndRemove(req.params.id)
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};
