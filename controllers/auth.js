const User = require("../models/User");
const md5 = require("md5");
const jwt = require("jsonwebtoken");
const config = require("../config/authconfig.js");
const { validationResult } = require("express-validator");

exports.login = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).send({ message: "Error occured at validation" });
    return;
  }
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        res.status(200).send({ message: "User not found" });
        return;
      }
      if (md5(password) == user.password) {
        console.log("passwords matched");
        const token = jwt.sign(
          { id: user._id, role: user.role },
          config.secret,
          {
            expiresIn: 86400,
          }
        );

        res
          .status(200)
          .send({ message: "Login successful", token: token, role: user.role });
        return;
      } else {
        res.status(200).send({ message: "Wrong Password" });
        return;
      }
    })
    .catch((err) => {
      res.status(200).json({ message: "Error occured" });
    });
};

exports.signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).send({ message: "Error occured at validation" });
    return;
  }
  const email = req.body.email;
  const password = req.body.password;
  const username = req.body.username;
  const address = "Sanganer, Jaipur, India";
  console.log("in sign up");
  User.findOne({ username: username }).then((user) => {
    if (user) {
      res.status(200).send({ message: "Username already in use" });
      return;
    } else {
      User.findOne({ email: email }).then((u) => {
        if (u) {
          res.status(200).send({ message: "Email already in use." });
          return;
        }
        const user = new User({
          email: email,
          username: username,
          role: "customer",
          password: md5(password),
          address: address,
        });
        user.save((err, user) => {
          if (err) {
            console.log(err);
            res.status(200).send({ message: "User sign up failed." });
            return;
          }
          res.status(200).send({ message: "User signed up" });
          return;
        });
      });
    }
  });
};

exports.checklogin = (req, res, next) => {
  console.log("checking status");
  return res.status(200).json({ message: "User is logged in", role: req.role });
};

exports.profile = (req, res, next) => {
  User.findOne({ _id: req.userId })
    .then((user) => {
      res.status(200).send({ message: "User profile", user: user });
    })
    .catch((err) => {
      res.status(400).send({ message: "Some error occured", error: err });
    });
};

exports.inactivate = (req, res, next) => {
  User.findByIdAndUpdate({ _id: req.userId }, { deleted: true })
    .then((user) => {
      res.status(200).send({ message: "User inactivated", user: user });
    })
    .catch((err) => {
      res.status(400).send({ message: "Inactivation failed" });
    });
};
