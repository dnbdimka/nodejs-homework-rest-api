const express = require("express");
const router = express.Router();
const ctrlAuth = require("../../controllers/auth.js");
const ctrlUser = require("../../controllers/user.js");
const { auth } = require("../../service/middlewares/auth.js");
const upload = require("../../service/multer/user.js");
// const auth = require("./../../middlewares/checkToken.js");

router.post("/signup", ctrlAuth.register);
router.post("/signin", ctrlAuth.login);
router.post("/logout", auth, ctrlAuth.logout);
router.get("/current", auth, ctrlUser.getUser);
router.patch("/", auth, ctrlUser.updateSubscription);
router.patch("/avatars", auth, upload.single("avatar"), ctrlUser.updateAvatar);

module.exports = router;
