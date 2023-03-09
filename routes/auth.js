const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const { check } = require("express-validator");

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

module.exports = router;
