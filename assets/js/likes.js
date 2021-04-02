
  ("use strict");

  let attachLike = function () {
    let likeButton = $(".toggle-like-button");
    likeButton.click(function (e) {
      e.preventDefault();
      let postId = $(this).attr("id");

      $.ajax({
        type: "GET",
        url: $(this).prop("href"),
        success: (data) => {
          let likes = $(`#likes-count-${postId}`);
          let likesCount = likes.attr("data-like");
          likes.empty();
          if (data.data.deleted) {
            likes.append(parseInt(likesCount) - 1);
            likes.attr("data-like", likesCount - 1);
          } else {
            likes.append(parseInt(likesCount) + 1);
            likes.attr("data-like", parseInt(likesCount) + 1);
          }
        },
      });
    });
  };

  attachLike();

