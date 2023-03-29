const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const { check } = require("express-validator");
const isAuth = require("../middleware/is-auth");

router.post(
  "/login",
  [check("email").isEmail(), check("password").isLength({ min: 5, max: 15 })],
  authController.login
);
router.post(
  "/signup",
  [
    check("email").isEmail(),
    check("password").isLength({ min: 5, max: 15 }),
    check("username").isLength({ min: 5 }),
  ],
  authController.signup
);
router.get("/inactivateUser", isAuth, authController.inactivate);
router.get("/checklogin", isAuth, authController.checklogin);
router.get("/profile", isAuth, authController.profile);

module.exports = router;
