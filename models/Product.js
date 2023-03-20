const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  productname: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageURLs: [
    {
      type: String,
    },
  ],
  available_quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Product", UserSchema);
