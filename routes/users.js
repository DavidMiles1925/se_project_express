const router = require("express").Router();
const auth = require("../middlewares/auth");
const userController = require("../controllers/users");

router.get("/", auth, userController.getUsers);
router.get("/me", auth, userController.getCurrentUser);
router.get("/:UserId", userController.getUserById);

router.patch("/me", userController.updateProfile);

module.exports = router;
