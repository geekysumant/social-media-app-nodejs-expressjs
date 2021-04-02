const Post = require("../models/post");
const User = require("../models/user");

module.exports.home = async (req, res) => {
  if(req.user){  let posts = await Post.find({})
      .sort("-createdAt")
      .populate({
        path: "user",
        select: "_id name email avatar createdAt"
      })
      .populate({
        path: "comments",
        populate: {
          path: "user",
          select: "_id name email avatar createdAt"
        },
      })
      .populate({
        path: "likes",
        populate: {
          path: "user",
          select: "_id name avatar"
        },
      });
      

    let users = await User.find({});
    return res.render("home", {
      title: "Home",
      posts: posts,
      users: users,
    });}
    else {
      return res.redirect('/users/signin');
    }
};
