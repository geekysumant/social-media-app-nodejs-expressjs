const Post = require("../models/post");
const Comment = require("../models/comment");


module.exports.create = async (req, res) => {
  try {
    Post.uploadedImage(req, res, async (err) => {
      if (err) {
        console.log("*****MULTER ERROR*****", err);
        return;
      }
      console.log(req.file);
      let post = await Post.create({
        content: req.body.content,
        user: req.user._id,
      });
      if (req.file) {
        console.log(req.file);
        post.image = Post.imagePath + "/" + req.file.filename;
        post.save();
      }
      await post.populate("user").execPopulate();
      if (req.xhr) {
        return res.status(200).json({
          data: {
            post: post,
          },
          message: "Post Created!",
        });
      }
      return res.redirect("back");
    });
  } catch (err) {
    req.flash("error", "Some error occurred!");
  }
};

module.exports.comment = (req, res) => {
  Comment.create({
    comment: req.body.comment,
    user,
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

        if (req.xhr) {
          return res.status(200).json({
            data: {
              post_id: req.params.id,
            },
          });
        }
        return res.redirect("back");
      }
    }
  } catch (err) {
    req.flash("error", "Some error occurred");
    return res.redirect("back");
  }
};



module.exports.showLikes=async (req,res)=>{
  try {
    let postId=req.params.id;
    let post= await Post.findById(postId)
    .populate({
      path: "likes",
      populate: {
        path: "user",
        select: "_id name"
      },
    });
    let likeUpdated= [];
    for(like of post.likes){
      likeUpdated.push({
        _id: like._id,
        user: like.user
      })
    }

    return res.status(200).json({
      likeUpdated
    });
  } catch (error) {
    
  }
}