const User = require("../models/user");
const Post = require("../models/post");
const ResetPassword = require("../models/reset_password_user");
const Token = require("../models/token");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const verifyUserMailer = require("../mailers/verify_user_mailer");

module.exports.profile = async (req, res) => {
  User.findById(req.params.id, (err, user) => {
    Post.find({ user: user._id })
      .sort("-createdAt")
      .populate("user")
      .populate({
        path: "comments",
        populate: {
          path: "user",
        },
      })
      .populate({
        path: "likes",
        populate: {
          path: "user",
          select: "_id name avatar"
        },
      })
      .exec((err, posts) => {
        return res.render("profile", {
          profile_user: user,
          posts: posts,
        });
      });
  });
};
module.exports.posts = (req, res) => {
  res.end("<h1>User's Posts</h1>");
};
module.exports.signin = (req, res) => {
  if(!req.user)
    return res.render("signin");
  else
    return res.redirect("/");
};
module.exports.signup = (req, res) => {
  if(!req.user)
    return res.render("signup");
  else
    return res.redirect("/");
};
module.exports.create = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    
    if (!user) {
      const accessToken = crypto.randomBytes(20).toString("hex");
      let user = await User.create({
        email: req.body.email,
        name: req.body.name,
        password: req.body.password,
        avatar: "/uploads/avatar-default.jpeg",
      });
      let userToken = await Token.create({
        userId: user._id,
        token: accessToken,
      });

      userToken = await userToken.populate("userId").execPopulate();
      verifyUserMailer.sendVerification(userToken);
      
      
      return res.render("verification_sent");
    
    } else if (!user.isVerified) {
      let accessToken = await Token.findOne({ userId: user._id });
      accessToken = await accessToken.populate("userId").execPopulate();
      verifyUserMailer.sendVerification(accessToken);
      
      return res.render("verification_sent");
    } else {
      return res.redirect("back");
    }
  } catch (err) {
    console.log(err);
    return res.redirect("back");
  }
};
//sign in user and create new session
module.exports.createSession = (req, res) => {
  
  req.flash("success", "Logged in successfully!");
  return res.redirect("/");
};
module.exports.destroySession = (req, res) => {
  req.logout();
  req.flash("success", "Logged out successfully!");
  return res.redirect("/");
};

module.exports.update = async (req, res) => {
  if (req.user.id == req.params.id) {
    try {
      let user = await User.findById(req.params.id);

      User.uploadedAvatar(req, res, (err) => {
        if (err) {
          console.log("*********MULTER ERROR*********", err);
        }

        user.name = req.body.name;
        user.email = req.body.email;

        if (req.file) {
          console.log(req.file);
          user.avatar = User.avatarPath + "/" + req.file.filename;
        }
        user.save();
        return res.redirect("back");
      });
    } catch (err) {
      req.flash("error", err);
      return res.redirect("back");
    }
  } else {
    req.flash("error", "Unauthorized!");
    return res.status(401).send("Unauthorized");
  }
};

module.exports.search = async (req, res) => {
  try {
    let users = await User.find({
      name: { $regex: new RegExp(req.body.search_user, "i") },
    }).sort("name");
    let usersFields = [];
    for (let user of users) {
      usersFields.push({
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      });
    }
    if (users.length) {
      return res.render("search_users", {
        users: usersFields,
      });
    } else {
      return res.render("search_users", {
        message: "No user(s) found",
      });
    }
  } catch (err) {
    console.log(err);
  }
};
