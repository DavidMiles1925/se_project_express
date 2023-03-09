const router = require("express").Router;
const { getItems, createItem, deleteItem } = require("../models/item");

router.get("/", getItems);
router.post("/", createItem);
router.delete("/:ItemId", deleteItem);

module.exports = router;
