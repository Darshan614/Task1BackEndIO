const User = require("../models/User");
const md5 = require("md5");
const jwt = require("jsonwebtoken");
// const config = require("../config/authconfig.js");
const { validationResult } = require("express-validator");
const crypto = require("crypto");
var nodemailer = require("nodemailer");
// const { EMAIL, PASS } = require("../env");

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
          process.env.secret,
          {
            expiresIn: 86400,
          }
        );
        User.findOneAndUpdate({ email: email }, { deleted: false })
          .then((user) => {
            console.log("user updated", user);
          })
          .catch((err) => {
            console.log("errr", err);
          });
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
  const address = req.body.address;
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

          return res.status(200).send({ message: "User signed up" });
          // var transporter = nodemailer.createTransport({
          //   service: "gmail",
          //   auth: {
          //     user: EMAIL,
          //     pass: PASS,
          //   },
          // });

          // var mailOptions = {
          //   from: "jaindarshan849@gmail.com",
          //   to: email,
          //   subject: "SignUp successful",
          //   text: "SignUp successfull",
          //   html: "<h1>SignUp successful! <h2>Happy Shopping</h2></h1>",
          // };

          // transporter.sendMail(mailOptions, function (error, info) {
          //   if (error) {
          //     console.log(error);
          //   } else {
          //     console.log("Email sent: " + info.response);
          //   }
          // });
          // return;
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

exports.resetPassword = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.send({ message: "Failed" });
    }
    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          res.status(200).send({ message: "User not found" });
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then((result) => {
        //send a Email
        var transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL,
            pass: process.env.PASS,
          },
        });
        const mailOptions = {
          to: req.body.email,
          from: "jaindarshan849@gmail.com",
          subject: "Reset Password",
          text: "Link for password reset",
          html: `<h1>Click this <a href="http://localhost:3000/reset/${token}">link</a> to reset password</h1>`,
        };
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent: " + info.response);
          }
        });
        return res
          .status(200)
          .send({ message: "Password reset link sent to given Email" });
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

exports.setPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then((user) => {
      if (!user) {
        return res.status(400).send({ message: "Try again later" });
      }
      const newPassword = md5(req.body.password);
      user.password = newPassword;
      console.log("np", newPassword);
      user.resetToken = undefined;
      user.resetTokenExpiration = undefined;
      user.save();
      return res.status(200).send({ message: "Password reset successful" });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.updateProfile = (req, res, next) => {
  User.findOneAndUpdate(
    { _id: req.userId },
    { username: req.body.username, address: req.body.address }, {new:true}
  )
    .then((result) => {
      console.log("result",result);
      return res.status(200).send({ message: "User profile updated",result:result });
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).send({ message: "Update failed" });
    });
};
