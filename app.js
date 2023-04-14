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

app.post('/webhooks/stripe', async (req, res) => {
  const event = req.body;
let validatedEvent;
  // Verify the webhook signature
  try {
    const signature = req.headers['stripe-signature'];
    validatedEvent = stripe.webhooks.constructEvent(event, signature, process.env.STRIPE);
  } catch (error) {
    console.error('Error validating webhook signature:', error.message);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  // Handle the "payment_intent.succeeded" event
  if (validatedEvent.type === 'payment_intent.succeeded') {
    const paymentIntent = validatedEvent.data.object;
    // Handle payment success, e.g. update database, send confirmation email, etc.
    console.log("payment was successfull using webhooks")
  }

  res.sendStatus(200);
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
