const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  feedback: {
    type: String,
    required: true,
  },
  reviewed_at: {
    type: Date,
    default: Date.now,
  },
  userName: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Review", reviewSchema);
