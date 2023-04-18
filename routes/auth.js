const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const { check } = require("express-validator");
const isAuth = require("../middleware/is-auth");

router.post(
  "/login",
  [check("email").isEmail(), check("password").isLength({ min: 8, max: 16 })],
  authController.login
);
router.post(
  "/signup",
  [
    check("email").isEmail(),
    check("password").isLength({ min: 8, max: 16 }),
    check("username").isLength({ min: 5, max: 15 }),
    check("address").isLength({min: 6, max:30})
  ],
  authController.signup
);
router.get("/inactivateUser", isAuth, authController.inactivate);
router.get("/checklogin", isAuth, authController.checklogin);
router.get("/profile", isAuth, authController.profile);
router.post("/reserPassword", authController.resetPassword);
router.post("/resetPassword", authController.resetPassword);
router.post("/setPassword/:token", authController.setPassword);
router.post("/updateProfile",[check("username").isLength({ min: 5, max:15 }),check("address").isLength({min: 6, max:30})],isAuth,authController.updateProfile);

module.exports = router;
