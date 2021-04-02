class Comment {
  constructor(postId) {
    this.postId = postId;
    this.postContainer = $(`#post-${this.postId}`);
    this.addCommentFormButton = $(`#add-comment-button-${this.postId}`);
    this.deleteCommentLink = this.addCommentForm(this.addCommentFormButton);
    this.commentsCount = $(`#comments-count-${this.postId}`);
    let self = this;
    $(" .delete-comment-button", this.postContainer).each(function () {
      self.deleteComment(this);
    });
  }

  createComment() {
    let pSelf = this;

    let commentForm = $(`#form-${this.postId}`);
    commentForm.submit(function (e) {
      e.preventDefault();
      let self = this;

      $.ajax({
        type: "POST",
        url: "/comments/create",
        data: $(self).serialize(),
        success: (data) => {
          let newComment = pSelf.newCommentDom(data.data.comment);
          $(`#comment-container-${pSelf.postId}`).prepend(newComment);
          pSelf.deleteComment($(" .delete-comment-button", newComment));

          new Noty({
            theme: 'relax',
            text: "Comment Created!",
            type: 'success',
            layout: 'topRight',
            timeout: 1500
            
        }).show();

          let comments = $(pSelf.commentsCount).attr("data-comment");
          comments = parseInt(comments) + 1;
          pSelf.commentsCount.empty();
          pSelf.commentsCount.attr("data-comment", comments);
          pSelf.commentsCount.append(comments);
        },
        error: (err) => {},
      });
    });
  }

  addCommentForm(addCommentForm) {
    let self = this;
    addCommentForm.click(function (e) {
      e.preventDefault();
      let commentFormContainer = $(
        `#comment-form-container-${$(this).prop("value")}`
      );
      commentFormContainer.prepend(
        self.commentFormDom(addCommentForm.prop("value"))
      );
      $(this).remove();
      self.createComment();
      self.deleteComment();
    });
  }

  deleteComment(deleteLink) {
    let pSelf = this;
    $(deleteLink).click(function (e) {
      e.preventDefault();

      $.ajax({
        type: "get",
        url: $(deleteLink).prop("href"),
        success: function (data) {
          $(`#comment-${data.data.comment_id}`).remove();

          new Noty({
            theme: "relax",
            text: "Comment Deleted",
            type: "success",
            layout: "topRight",
            timeout: 1500,
          }).show();

          let comments = $(pSelf.commentsCount).attr("data-comment");
          comments = parseInt(comments) - 1;
          pSelf.commentsCount.empty();
          pSelf.commentsCount.attr("data-comment", comments);
          pSelf.commentsCount.append(comments);
        },
        error: function (error) {},
      });
    });
  }

  commentFormDom(id) {
    return $(`
      <form id='form-${id}' class="new-comment-form d-flex justify-content-between align-items-center" action="/comments/create" method="POST" style="width: 100%;">
                  <input type="hidden" value="${id}" name="post">
                  <textarea placeholder="Comment..."
                      style=" outline: none;resize: none;background-color: #f0f2f5; border-radius: 40px; padding: 2%;"
                      class="col-auto" name="comment" cols="30" rows="1"></textarea>
                  <button class="make-comment" type="submit"> 
                      <i class="far fa-comment-alt"></i>
                  </button>
              </form>
      `);
  }

  newCommentDom(comment) {
    return $(`<div id='comment-${comment._id}'  class="mb-3">
                  <div class="d-flex justify-content-between align-items-center">
                    <div class="d-flex" style="width: 100%;">
                        <div>
                            <img src="${comment.user.avatar}" alt="" width="35" height="35" style="border-radius: 100px;">
                        </div>
                        <div  style="width: 70%; border-radius: 20px; padding-left: 3%; background-color: #f0f2f5;">
                            <h6 style="margin: 0 !important;"> ${comment.user.name}</h6>
                            <span>
                                ${comment.comment}
                            </span>
                        </div>
                     </div>
                          <div>
                              <a class='delete-comment-button' href="/comments/destroy/${comment._id}">
                                  <i class="fas fa-trash-alt"></i>
                              </a>
                          </div>
                  </div>
              </div>`);
  }
}
