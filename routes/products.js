const express = require("express");
const router = express.Router();
const productController = require("../controllers/products");
const isAuth = require("../middleware/is-auth");

router.get("/products", productController.products);
// router.get("/productInfo", productController.productInfo);
router.post("/cartData", productController.cartData);

module.exports = router;
