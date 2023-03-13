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
  imageURL: {
    type: String,
    required: true,
  },
  available_quantity: {
    type: Number,
    required: true,
  },
  price:{
    type: Number,
    required: true
  }
});

module.exports = mongoose.model("Product", UserSchema);