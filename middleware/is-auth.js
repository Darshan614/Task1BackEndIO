const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.get("Authorization").split(" ")[1];
  console.log("printing token",token);
  let decodedtoken;
  try {
    decodedtoken = jwt.verify(token, process.env.secret);
  } catch (err) {
    res.status(500).send({ message: "Some problem in authentication" });
    return;
  }

  if (!decodedtoken) {
    res.status(400).send({ message: "Invalid token" });
    return;
  }
  req.userId = decodedtoken.id;
  req.role = decodedtoken.role;
  console.log(req.userId, req.role);
  next();
};
