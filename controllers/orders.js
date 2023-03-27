const express = require("express");
const app = express();
const Product = require("../models/Product");
const User = require("../models/User");
const Order = require("../models/Orders");
const stripe = require("stripe")(
  "sk_test_51IIwkrIAShPifzT0mWvMCw7riPsQbS7IKNiDjaLtDZzMDAexSgT85v8rXAtqg8DyaMgb7AykU3Xuv1jA5TqieKiW00BcidtSM6"
);

function foo21(cart) {
  return new Promise((resolve) => {
    let promises = [];
    // console.log("cart in foo", cart);
    cart.forEach((c) => {
      // console.log("15q", Object.values(c)[0]);
      promises.push(
        Product.findOneAndUpdate(
          { _id: Object.keys(c)[0] },
          { $inc: { available_quantity: -Object.values(c)[0] } }
        ).lean()
      );
    });

    console.log("before promise");
    Promise.all(promises).then((values) => {
      resolve(values);
    });
  });
}
exports.placeOrder = async (req, res, next) => {
  const cart = req.body.cart;
  // console.log("31", cart);
  const data2 = await foo21(cart);
  const cartData = req.body.cart;
  // console.log(
  //   cartData,
  //   req.userId,
  //   "ddddddddddddddddddddddddddddddddddddd",
  //   data2
  // );

  const productList = [];
  let total = 0;
  for (let a = 0; a < cartData.length; a++) {
    total += Object.values(cartData[a])[0] * data2[a].price;
    var newObj = {
      product: Object.keys(cartData[a])[0],
      quantity: Object.values(cartData[a])[0],
      price: data2[a].price,
    };
    productList.push(newObj);
  }
  // console.log(productList);
  const order = new Order({
    user: req.userId,
    products: productList,
    total: total,
  });

  order
    .save()
    .then((savedOrder) => {
      console.log("Order saved successfully:", savedOrder);
    })
    .catch((error) => {
      console.error("Error saving order:", error);
    });

  res.status(200).send({ message: "Object created" });
};

function foo2(cart) {
  return new Promise((resolve) => {
    let promises = [];
    // console.log("cart in foo", cart);
    cart.forEach((c) => {
      promises.push(Product.findOne({ _id: Object.keys(c)[0] }).lean());
    });

    console.log("before promise");
    Promise.all(promises).then((values) => {
      resolve(values);
    });
  });
}
exports.checkout = async (req, res) => {
  const cart = req.body.cart;
  const data2 = await foo2(cart.cartList);
  // const mockdata = { ...data2[0] };
  // data2[0] = { ...mockdata, quantity: 2 };
  // console.log(data2[0]);
  for (let a = 0; a < data2.length; a++) {
    // console.log(data2[a], Object.values(cart.cartList[a])[0]);
    data2[a] = { ...data2[a], quantity: Object.values(cart.cartList[a])[0] };
    //console.log(data2[a]);
  }
  // console.log("data", data2);
  const session = await stripe.checkout.sessions.create({
    line_items: data2.map((prod) => {
      return {
        name: prod.productname,
        quantity: prod.quantity,
        amount: prod.price * 100,
        currency: "inr",
      };
    }),
    mode: "payment",
    success_url: "http://localhost:3000/success",
    cancel_url: "http://localhost:3000/cancel",
  });
  // console.log(session.url);
  // res.redirect(303, session.url);
  res.status(200).send({ url: session.url });
};
