const express = require("express");
const app = express();
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const isAuth = require("./middleware/is-auth");
const generalRoutes = require("./routes/general");
const adminRoutes = require("./routes/admin");
const productRoutes = require("./routes/products");

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  next();
});
app.use(productRoutes);
app.use(generalRoutes);
app.use(adminRoutes);
app.use(authRoutes);

mongoose
  .connect(
    "mongodb+srv://darshan:msdhoni@cluster0.oantu.mongodb.net/Assignment?retryWrites=true&w=majority"
  )
  .then((result) => {
    app.listen(8080);
    console.log("Server started");
  })
  .catch((err) => {
    console.log("Some error ocurred");
    console.log(err);
  });
