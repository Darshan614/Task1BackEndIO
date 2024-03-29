const express = require("express");
const router = express.Router();
const productController = require("../controllers/products");
const isAuth = require("../middleware/is-auth");

// router.get("/products/:page", productController.products);
router.get("/products", productController.products);
router.get("/productCount/:category", productController.productCount);
router.post("/productInfo", productController.productInfo);
router.post("/cartData", productController.cartData);
router.post("/similarProducts", productController.similarProducts);
router.post("/addReview", isAuth, productController.addProductReview);
router.get("/getReviews/:productId", productController.getProductReviews);

module.exports = router;
