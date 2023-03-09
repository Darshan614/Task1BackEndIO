exports.home = (req, res, next) => {
  res.status(200).send({ message: "Welcome home friend" });
};
