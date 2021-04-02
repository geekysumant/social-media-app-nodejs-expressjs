{
    let newPostForm = $("#new-post-form");
  
    let newPost = function () {
      newPostForm.submit((e) => {
        e.preventDefault();
  
        var formData = new FormData(document.getElementById("new-post-form"));
        console.log(formData);
        $.ajax({
          type: "post",
          url: "/posts/create",
          processData: false,
          contentType: false,
          data: formData,
          success: (data) => {
              let newPost;
            if (data.data.post.image) {
              newPost = newPostDomIfImagePresent(data.data.post);
              $("#posts-list-container").prepend(newPost);
              deletepost($(" .delete-post-button", newPost));
            } else {
              newPost = newPostDomIfImageNotPresent(data.data.post);
              $("#posts-list-container").prepend(newPost);
              deletepost($(" .delete-post-button", newPost));
            }

            new Noty({
                theme: 'relax',
                text: "Post Created!",
                type: 'success',
                layout: 'topRight',
                timeout: 1500
                
            }).show();

            attachLike();
            let postId= $(newPost).attr('id').split('-')[1];
            console.log(postId);
            new Comment(postId);    
            
          },
          error: (err) => {
            console.log(err.responseText);
          },
        });
      });
    };
  
    let deletepost = (deleteLink) => {
      $(deleteLink).click((e) => {
        e.preventDefault();
  
        $.ajax({
          type: "get",
          url: $(deleteLink).prop("href"),
          success: (data) => {
            $(`#post-${data.data.post_id}`).remove();

            new Noty({
                theme: 'relax',
                text: "Post Deleted",
                type: 'success',
                layout: 'topRight',
                timeout: 1500
                
            }).show();


          },
        });
      });
    };
  
    let postAjax = function () {
      $("#posts-list-container>div").each(function () {
        let self = $(this);
        deletepost($(" .delete-post-button", self));
        let postId= self.attr('id').split('-')[1];

        new Comment(postId);
        
      });
    };
  
    let newPostDomIfImagePresent = (p) => {
      return $(`<div id='post-${p._id}' class="single-post card p-3 mb-5 mt-4" style="border-radius: 20px; width: 28rem; margin-bottom: 90px !important; box-shadow: lightgray 5px 5px 10px;">
      <div class="d-flex justify-content-between">
        <div class="d-flex align-items-center">
            <img class="ml-3" src="${p.user.avatar}" alt="${p.user.name}" width="50" height="50" style="border-radius: 100px;">
            <h5 class="card-title" style="margin: 0 !important;">
                ${p.user.name}
            </h5>
        </div>
          
              <div>
                  <a class="delete-post-button" href="/posts/destroy/${p._id}">
                      <i class="fas fa-trash-alt"></i>
                  </a>
              </div>
      </div>
      <small class="text-muted mb-2">
          now
      </small>
      <div class="card-body bg-light" style="width: 95%;border-radius: 30px;">
          <p>
              ${p.content}
          </p>
          <div style="text-align: center;">
              <img src="${p.image}" alt="" width="300px" height="300px">
          </div>
      </div>
      <div id='new-comment' data-id="${p._id}" class="mt-4 d-flex flex-column align-items-center justify-content-center mb-1" >    
            <div class="d-flex justify-content-between" style="width: 80%;">
                <span>
                    <span id='likes-count-${p._id}' data-like="${p.likes.length}"> ${p.likes.length}</span>
                    <i class="far fa-thumbs-up"></i>
                </span>
                <span>
                    <span id='comments-count-${p._id}' data-comment="${p.comments.length}"> ${p.comments.length} </span>
                    <i class="far fa-comment-alt"></i>
                    
                </span>
            </div>
            <div class="border-bottom"></div>
            
            <div class="d-flex justify-content-between"style="width:60%">
                <a class='toggle-like-button' href="/likes/toggle/?id=${p._id}&type=Post" id='${p._id}'>
                    <i class="far fa-thumbs-up"></i>
                    Like
                </a>
                <button class="add-comment-button" id='add-comment-button-${p._id}' value="${p._id}">
                    <i class="far fa-comment-alt"></i>
                    Comment
                </button>
            
            
            </div>
            <div class="border-bottom"></div>
            <div id='comment-form-container-${p._id}' style="width: 90%;"></div>


      </div>    

      <div id="comment-container-${p._id}">
            </div>
  </div>
  `);
    };
  
    let newPostDomIfImageNotPresent = (p) => {
      return $(`<div id='post-${p._id}' class="single-post card p-3 mb-5 mt-4" style="border-radius: 20px; width: 28rem; margin-bottom: 90px !important; box-shadow: lightgray 5px 5px 10px;">
      <div class="d-flex justify-content-between">
        <div class="d-flex align-items-center">
            <img class="ml-3" src="${p.user.avatar}" alt="${p.user.name}" width="50" height="50" style="border-radius: 100px;">
            <h5 class="card-title" style="margin: 0 !important;">
              ${p.user.name}
          </h5>
        </div>
          
              <div>
                  <a class="delete-post-button" href="/posts/destroy/${p._id}">
                      <i class="fas fa-trash-alt"></i>
                  </a>
              </div>
      </div>
      <small class="text-muted mb-2">
          now
      </small>
      <div class="card-body bg-light" style="width: 95%;border-radius: 30px;">
          <p>
              ${p.content}
          </p>
      </div>
      <div id='new-comment' data-id="${p._id}" class="mt-4 d-flex flex-column align-items-center justify-content-center mb-1" >
            <div class="d-flex justify-content-between" style="width: 80%;">
            <span>
                <span id='likes-count-${p._id}' data-like="${p.likes.length}"> ${p.likes.length}</span>
                <i class="far fa-thumbs-up"></i>
            </span>
            <span>
                <span id='comments-count-${p._id}' data-comment="${p.comments.length}"> ${p.comments.length} </span>
                <i class="far fa-comment-alt"></i>
                
            </span>
        </div>
        <div class="border-bottom"></div>
        
        <div class="d-flex justify-content-between"style="width:60%">
            <a class='toggle-like-button' href="/likes/toggle/?id=${p._id}&type=Post" id='${p._id}'>
                <i class="far fa-thumbs-up"></i>
                Like
            </a>
            <button class="add-comment-button" id='add-comment-button-${p._id}' value="${p._id}">
                <i class="far fa-comment-alt"></i>
                Comment
            </button>
        
        
        </div>
        <div class="border-bottom"></div>
        <div id='comment-form-container-${p._id}' style="width: 90%;"></div>

        

      </div>    
      <div id="comment-container-${p._id}">
            </div>
  </div>


  `);
    };
  
  
    newPost();
    postAjax();

}
  
  