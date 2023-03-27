const express = require('express');
const router = express.Router();
const isAuth = require("../middleware/is-auth");
const orderControllers = require('../controllers/orders');

router.post("/create-checkout-session",orderControllers.checkout);
router.post("/placeOrder",isAuth, orderControllers.placeOrder);

module.exports = router;