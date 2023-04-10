const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
// console.log(process.env);
app.use(cors());
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const isAuth = require("./middleware/is-auth");
const generalRoutes = require("./routes/general");
const adminRoutes = require("./routes/admin");
const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");
const Product = require("./models/Product");

const bodyParser = require("body-parser");
const Order = require("./models/Orders");
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
app.use(orderRoutes);

app.get("/addcategory", (req, res, next) => {
  Product.updateMany(
    {},
    { $set: { numberOfReviews: 10 } },
    { upsert: false, multi: true }
  ).then((res) => {
    console.log(res);
  });
});
const port = process.env.PORT || 8080;
const uri =
  "mongodb+srv://" +
  process.env.MONGO_USERNAME +
  ":" +
  process.env.MONGO_PASSWORD +
  "@cluster0.oantu.mongodb.net/Assignment?retryWrites=true&w=majority";
mongoose
  .connect(uri)
  .then((result) => {
    app.listen(port);
    console.log("Server started");
  })
  .catch((err) => {
    console.log("Some error ocurred");
    console.log(err);
  });
