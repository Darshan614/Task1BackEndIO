const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");

router.get("/employeeData", isAuth, adminController.employeeData);
router.post("/addproduct", isAuth, adminController.addproduct);

module.exports = router;
