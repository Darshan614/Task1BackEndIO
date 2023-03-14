const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");
const { check } = require("express-validator");

router.get("/employeeData", isAuth, adminController.employeeData);
router.post("/addproduct", isAuth,[
    check("imageURL").isURL(),
    check("productname").isLength({ min: 10, max: 20}),
    check("description").isLength({ min: 5, max:20 }),
    check("price").isNumeric(),
    check("availablequantity").isNumeric()
  ], adminController.addproduct);

module.exports = router;
