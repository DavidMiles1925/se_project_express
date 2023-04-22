const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/items");

router.get("/", getItems);
router.post("/", auth, createItem);
router.delete("/:ItemId", auth, deleteItem);
router.put("/:ItemId/likes", auth, likeItem);
router.delete("/:ItemId/likes", auth, dislikeItem);

module.exports = router;
