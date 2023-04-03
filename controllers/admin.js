const Product = require("../models/Product");
const { validationResult } = require("express-validator");
const User = require("../models/User");

exports.employeeData = (req, res, next) => {
  if (req.role == "admin") {
    return res.status(200).send({ message: "You can view employee data" });
  } else {
    res.status(403).send({ message: "Sorry Permission denied" });
    return;
  }
};

exports.addproduct = (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    res.status(422).send({ message: "Error occured at validation" });
    return;
  }
  if (!(req.role == "admin")) {
    return res.status(403).send({ message: "Sorry Permission denied" });
  } else {
    const product = new Product({
      productname: req.body.productname,
      price: req.body.price,
      description: req.body.description,
      imageURLs: [req.body.imageURL],
      available_quantity: req.body.availablequantity,
      category:req.body.category,
      rating:5
    });
    product.save((err, product) => {
      if (err) {
        return res.status(200).json({ message: "Product addition failed" });
      } else {
        return res.status(200).json({ message: "Product added" });
      }
    });
  }
};

exports.deleteUser = (req, res, next) => {
  if (req.role !== "admin") {
    return res.status(200).send({ message: "Permission denied" });
  }
  User.deleteOne({ email: req.body.email, username: req.body.username })
    .then((data) => {
      console.log("user deleted", data);
      return res.status(200).send({ message: "User deleted" });
    })
    .catch((err) => {
      return res
        .status(200)
        .send({ message: "Some error occured", error: err });
    });
};
