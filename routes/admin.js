const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");
const { check } = require("express-validator");

router.get("/employeeData", isAuth, adminController.employeeData);
router.post(
  "/addproduct",
  isAuth,
  [
    check("imageURLs").isArray({min:1,max:7}),
    check("productname").isLength({ min: 2, max: 25 }),
    check("description").isLength({ min: 5, max: 50 }),
    check("price").isNumeric(),
    check("availablequantity").isNumeric(),
  ],
  adminController.addproduct
);
router.post(
  "/editproduct",
  isAuth,
  [
    check("imageURLs").isArray({min:1,max:7}),
    check("productname").isLength({ min: 2, max: 25 }),
    check("description").isLength({ min: 5, max: 50 }),
    check("price").isNumeric(),
    check("availablequantity").isNumeric(),
  ],
  adminController.editproduct
);
router.post("/deleteUser", isAuth, adminController.deleteUser);

module.exports = router;
