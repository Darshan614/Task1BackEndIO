const express = require("express");
const app = express();
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const isAuth = require("./middleware/is-auth");
const generalRoutes = require("./routes/general");
const adminRoutes = require("./routes/admin");
const productRoutes = require("./routes/products");
const Product = require("./models/Product");

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

// app.get("/addcategory", (req, res, next) => {
//   Product.updateMany(
//     { productname: "Samsung Galaxy 6 Edge" },
//     {
//       $push: {
//         imageURLs: [
//           "https://images.unsplash.com/photo-1597639244466-3eb1b6d985bf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=465&q=80",
//           "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
//           "https://images.unsplash.com/photo-1583573636246-18cb2246697f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1038&q=80",
//           "https://images.unsplash.com/photo-1618478594486-c65b899c4936?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
//           "https://images.unsplash.com/photo-1610945264803-c22b62d2a7b3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
//         ],
//       },
//       rating: 5,
//     },
//     { upsert: false, muti: false }
//   ).then((result) => console.log(result));
// });

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
