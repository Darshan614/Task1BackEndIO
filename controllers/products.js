exports.products = (req, res, next) => {
  return res.status(200).send({ message: "Product list" });
};
