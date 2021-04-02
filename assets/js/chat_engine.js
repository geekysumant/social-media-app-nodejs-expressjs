class ChatEngine {
  constructor(chatBoxId, userEmail, userName, userAvatar) {
    this.chatBox = $(`#${chatBoxId}`);
    this.userEmail = userEmail;
    this.userName = userName;
    this.userAvatar = userAvatar;
    this.socket = io.connect("http://3.80.101.66:5000");

    if (this.userEmail) {
      this.connectionHandler();
    }
  }
  connectionHandler() {
    let self = this;

    this.socket.on("connect", function () {
      self.socket.emit("join_room", {
        user_email: self.userEmail,
        user_name: self.userName,
        user_avatar: self.userAvatar,
        chatroom: "codeial",
      });

      self.socket.on("user_joined", function (data) {
        console.log("user joined", data);
        let newUserJoined = $(`
                <li class='new-user-joined'>
                    <img src="${data.user_avatar}" alt="" width="35" height="35" style="border-radius: 100px;">
                    <span><b>${data.user_name}</b> joined the chat!</span>
                </li>
                `);
        $("#chat-message-list").append(newUserJoined);
      });
    });

    // CHANGE :: send a message on clicking the send message button
    $("#send-message").click(function () {
      let msg = $("#message").val();
      console.log(msg);

      if (msg != "") {
        self.socket.emit("send_message", {
          message: msg,
          user_email: self.userEmail,
          user_name: self.userName,
          user_avatar: self.userAvatar,
          chatroom: "codeial",
        });
      }
    });

    self.socket.on("receive_message", function (data) {
      let newMessage;
      let messageType = "other-message";

      newMessage = $(`
            <li class=${messageType}>
                <span class="style-message">
                    <div class= "d-flex align-items-center">
                        <img src="${data.user_avatar}" alt="" width="35" height="35" style="border-radius: 100px;">
                        <h6>${data.user_name}</h6>
                    </div>
                    <p>${data.message}</p>
                </span>
            </li>
            `);
      if (data.user_email == self.userEmail) {
        messageType = "self-message";
        newMessage = $(`
                <li class=${messageType}>
                <span class="style-message">
                <div class= "d-flex align-items-center justify-content-end">
                    <img src="${self.userAvatar}" alt="" width="35" height="35" style="border-radius: 100px;">
                    <h6>${self.userName}</h6>
                </div>
                <p>${data.message}</p>
            </span>
                </li>
                `);
      }
      $("#chat-message-list").append(newMessage);
    });
  }
}
