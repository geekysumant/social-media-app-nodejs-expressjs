const Post = require("../../../models/post");
const Comment = require("../../../models/comment");

module.exports.index = async (req, res) => {
  let posts = await Post.find({})
    .sort("-createdAt")
    .populate("user", "_id name email avatar")
    .populate({
      path: "comments",
      populate: {
        path: "user",
        select: "_id name email avatar",
      },
    });
  res.json(200, {
    message: "list_of_posts",
    posts: posts,
  });
};

module.exports.destroy = async (req, res) => {
  //.id converts it automaticlly into string
  try {
    let post = await Post.findById(req.params.id);
    if (post) {
      if (post.user == req.user.id) {
        post.remove();
        await Comment.deleteMany({ post: req.params.id });
        return res.json(200, {
          message: "Post deleted!",
        });
      }else{
        return res.status(401).json({
          message: "Unauthorized"
        });
      }
    }
  } catch (err) {
    return res.json(500, {
      message: "Internal Server Error",
    });
  }
};
