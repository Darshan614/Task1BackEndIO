const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  resetToken: String,
  resetTokenExpiration: Date,
  password: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  imageURL: {
    type: String,
    default:
      "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320/lsci/db/PICTURES/CMS/319900/319946.png",
  },
});

module.exports = mongoose.model("User", UserSchema);
