const Comment = require("../models/comment");
const Post = require("../models/post");
const comment_mailer=require('../mailers/comment_mailer');
const commentEmailWorker=require('../workers/comment_email_worker');
const queue=require('../config/kue');
 

module.exports.create = async (req, res) => {
  try {
    let post = await Post.findById(req.body.post);
    if (post) {
      let comment = await Comment.create({
        comment: req.body.comment,
        user: req.user._id,
        post: req.body.post,
      });
      post.comments.push(comment);
      post.save();
      
      await comment
      .populate({
        path:'user',
        select: "_id name email avatar"
      })
      .execPopulate();
      // comment_mailer.newComment(comment);
      let job=queue.create('emails',comment).save((err)=>{
      });

      if(req.xhr){
       
        return res.status(200).json({
          data: {
            comment:comment
          },
          message: "Comment created!"
        })
      }
      return res.redirect("back");
    } else {
      req.flash("error", "Some error occurred!");
      res.redirect("back");
    }
  } catch (err) {
    req.flash("error", "Some error occurred!");
  }
};

module.exports.destroy = async (req, res) => {
  try {
    let comment = await Comment.findById(req.params.id);

        if (comment.user == req.user.id){

            let postId = comment.post;

            comment.remove();

            let post = Post.findByIdAndUpdate(postId, { $pull: {comments: req.params.id}});

            // send the comment id which was deleted back to the views
            if (req.xhr){
                return res.status(200).json({
                    data: {
                        comment_id: req.params.id
                    },
                    message: "Post deleted"
                });
            }
            return res.redirect('back');
    } else {
      req.flash("error", "Some error occurred!");
      return res.redirect("back");
    }
  } catch (err) {
    req.flash("error", "Some error occurred!");
  }
};
