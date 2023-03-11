const router = require("express").Router();
const { getItems, createItem, deleteItem } = require("../controllers/items");

router.get("/", getItems);
router.post("/", createItem);
router.delete("/:ItemId", deleteItem);
router.put("./items/:itemId/likes");
router.delete("./items/:itemId/likes");

module.exports = router;
