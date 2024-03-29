const router = require("express").Router();
const auth = require("../middlewares/auth");
const userController = require("../controllers/users");
const { validateUserUpdate } = require("../middlewares/validation");

router.get("/me", auth, userController.getCurrentUser);

router.patch("/me", validateUserUpdate, auth, userController.updateProfile);

module.exports = router;
