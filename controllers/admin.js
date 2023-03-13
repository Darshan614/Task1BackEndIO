const Product = require("../models/Product");

exports.employeeData = (req, res, next) => {
  if (req.role == "admin") {
    return res.status(200).send({ message: "You can view employee data" });
  } else {
    res.status(403).send({ message: "Sorry Permission denied" });
    return;
  }
};

exports.addproduct = (req, res, next) => {
  if (!(req.role == "admin")) {
    return res.status(403).send({ message: "Sorry Permission denied" });
  } else {
    const product = new Product({
      productname: req.body.productname,
      price: req.body.price,
      description: req.body.description,
      imageURL: req.body.imageURL,
      available_quantity: req.body.availablequantity,
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
