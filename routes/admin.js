const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");

router.get("/employeeData", isAuth, adminController.employeeData);

module.exports = router;
