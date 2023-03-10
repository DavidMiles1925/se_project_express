const router = require("express").Router();
const { getUsers, getUserById, createUser } = require("../controllers/users");

router.get("/", getUsers);
router.get("/:UserId", getUserById);
router.post("/", createUser);

module.exports = router;
