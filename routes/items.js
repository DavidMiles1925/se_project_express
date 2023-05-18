const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/items");
const {
  validateItemBody,
  validateItemId,
} = require("../middlewares/validation");

router.get("/", getItems);
router.post("/", validateItemBody, auth, createItem);
router.delete("/:ItemId", validateItemId, auth, deleteItem);
router.put("/:ItemId/likes", validateItemId, auth, likeItem);
router.delete("/:ItemId/likes", validateItemId, auth, dislikeItem);

module.exports = router;
