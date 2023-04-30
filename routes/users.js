const router = require("express").Router();
const auth = require("../middlewares/auth");
const userController = require("../controllers/users");

router.get("/me", auth, userController.getCurrentUser);

router.patch("/me", auth, userController.updateProfile);

module.exports = router;
