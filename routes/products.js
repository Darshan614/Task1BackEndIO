const express = require("express");
const router = express.Router();
const productController = require("../controllers/products");
const isAuth = require("../middleware/is-auth");

router.get("/products", isAuth, productController.products);

module.exports = router;
