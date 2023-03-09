const express = require("express");
const router = express.Router();
const generalController = require("../controllers/general");

router.get("/home", generalController.home);

module.exports = router;
