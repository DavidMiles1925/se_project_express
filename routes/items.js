const router = require("express").Router();
const {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/items");

router.get("/", getItems);
router.post("/", createItem);
router.delete("/:ItemId", deleteItem);
router.put("/:ItemId/likes", likeItem);
router.delete("/:ItemId/likes", dislikeItem);

module.exports = router;
