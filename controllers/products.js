const Product = require("../models/Product");

exports.products = (req, res, next) => {
  const skip = (req.params.page - 1) * 12;
  Product.find()
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
  Product.countDocuments((err,count)=>{
    if(err){
      res.status(400).send({message:"Error occured in counting"});
    }
    else{
      res.status(200).send({message:"Count of documents",count:count});
    }
  })
}

// function foo(cart) {
//   let arr = [];
//   return new Promise((resolve, reject) => {
//     cart.forEach((c) => {
//       Product.find({ _id: c.id }).then((prod) => {
//         console.log(prod);
//         arr.push(prod);
//         resolve(arr);
//       });
//     });
//     console.log(arr, "here");
//   });
// }

function foo2(cart) {
  return new Promise((resolve) => {
    let promises = [];
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
  console.log("in info")
  Product.findOne({ _id: req.body.productId }).then((prod) => {
    console.log(req.body.productId);
    return res
      .status(200)
      .send({ message: "Product details", productData: prod });
  });
};
