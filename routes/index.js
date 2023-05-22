const router = require("express").Router();
const itemRouter = require("./items");
const userRouter = require("./users");
const { login, createUser } = require("../controllers/users");
const auth = require("../middlewares/auth");
const {
  validateUserInfo,
  validateUserLoginInfo,
} = require("../middlewares/validation");
const NotFoundError = require("../middlewares/notFoundError");

router.post("/signin", validateUserLoginInfo, login);
router.post("/signup", validateUserInfo, createUser);

router.use("/items", itemRouter);
router.use("/users", auth, userRouter);

router.use(() => new NotFoundError("Router not found"));

module.exports = router;
