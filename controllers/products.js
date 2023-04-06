const Product = require("../models/Product");
const Review = require("../models/Reviews");
const User = require("../models/User");

exports.products = (req, res, next) => {
  // const skip = 0;
  console.log(req.query);
  const skip = (req.query.page - 1) * 12;
  const category = req.query.category;
  let filter = {};
  if (category !== "all") {
    filter.category = category;
  }
  console.log(filter);
  console.log("in products");
  Product.find(filter, { imageURLs: { $slice: 1 } })
    .limit(12)
    .skip(skip)
    .then((products) => {
      return res
        .status(200)
        .send({ message: "Product list", products: products });
    })
    .catch((err) => {
      return res.status(200).send({ message: err });
    });
};

exports.productCount = (req, res, next) => {
  const category = req.params.category;
  let filter = {};
  if (category !== "all") {
    filter.category = category;
  }
  Product.countDocuments(filter, (err, count) => {
    if (err) {
      res.status(400).send({ message: "Error occured in counting" });
    } else {
      res.status(200).send({ message: "Count of documents", count: count });
    }
  });
  // Product.countDocuments({})
};

function foo2(cart) {
  return new Promise((resolve) => {
    let promises = [];
    console.log("cart in foo2", cart);
    cart.forEach((c) => {
      promises.push(Product.findOne({ _id: c.id }));
    });

    console.log("before promise");
    Promise.all(promises).then((values) => {
      resolve(values);
    });
  });
}

exports.cartData = async (req, res, next) => {
  const cart = req.body.cart;
  const data = await foo2(cart);
  console.log("after");
  res.status(200).send({ message: "Products data", productData: data });
};

exports.productInfo = (req, res, next) => {
  console.log("in info");
  Product.findOne({ _id: req.body.productId }).then((prod) => {
    console.log(req.body.productId);
    return res
      .status(200)
      .send({ message: "Product details", productData: prod });
  });
};

exports.similarProducts = (req, res, next) => {
  Product.find({ category: req.body.category }, { imageURLs: { $slice: 1 } })
    .limit(4)
    .then((data) => {
      // console.log(data);
      res.status(200).send({ message: "Data Found", data: data });
    });
};

exports.addProductReview = async (req, res, next) => {
  const uname = await User.findOne(
    { _id: req.userId },
    { username: 1, _id: 0 }
  );
  console.log(
    "username",
    uname,
    req.body.productId,
    req.body.rating,
    req.body.feedback
  );
  const newReview = new Review({
    userId: req.userId,
    userName: uname.username,
    productId: req.body.productId,
    rating: req.body.rating,
    feedback: req.body.feedback,
  });
  Product.findOneAndUpdate(
    { _id: req.body.productId },
    { $inc: { numberOfReviews: 1 } }
  );
  const product = await Product.findOne({ _id: req.body.productId });
  const newRating =
    (product.rating * product.numberOfReviews + req.body.rating) /
    (product.numberOfReviews + 1);
  const totalReviews = product.numberOfReviews + 1;
  console.log("113", product, newRating, totalReviews);
  Product.findOneAndUpdate(
    { _id: req.body.productId },
    { rating: newRating, numberOfReviews: totalReviews }
  ).then((res) => {
    console.log(res);
  });
  newReview.save((err, review) => {
    if (err) {
      console.log(err);
      return res
        .status(400)
        .send({ message: "Review addition failed", error: err });
    } else {
      return res
        .status(200)
        .send({ message: "Review added successfully", review: review });
    }
  });
};

exports.getProductReviews = async (req, res, next) => {
  try {
    const id = req.params.productId;
    const reviews = await Review.find({ productId: id });
    res
      .status(200)
      .send({ message: "Product reviews fetched", reviewsList: reviews });
  } catch (err) {
    res.status(400).send({ message: "Review fetch failed", error: err });
  }
};
