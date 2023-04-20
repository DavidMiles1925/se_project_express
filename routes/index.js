const router = require("express").Router();
const itemRouter = require("./items");
const userRouter = require("./users");
const { login, createUser } = require("../controllers/users");
const auth = require("../middlewares/auth");
const { NOT_FOUND_ERROR } = require("../utils/errorConstants");

router.post("/signin", login);
router.post("/signup", createUser);

router.use("/items", itemRouter);
router.use("/users", auth, userRouter);

router.use((_req, res) => {
  res.status(NOT_FOUND_ERROR).send({ message: "Router Not found" });
});

module.exports = router;
