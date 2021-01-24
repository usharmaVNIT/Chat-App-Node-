const {
  generateMessage,
  generateLocationMessage
} = require("../utils/message");
const { isRealString } = require("../utils/validation");

module.exports = function (io, users) {
  io.on("connection", (socket) => {
    socket.on("join", (params, callback) => {
      if (!isRealString(params.name) || !isRealString(params.room)) {
        return callback("Name And Roomname are required");
      } else {
        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room , params.initials);
        io.to(params.room).emit(
          "updateUserList",
          users.getUserList(params.room)
        );
        socket.emit(
          "welcomeConnected",
          generateMessage(
            "Admin",
            `Welcome ${params.name} to ChatApp , Room : ${params.room}`
          )
        );
        socket.broadcast
          .to(params.room)
          .emit(
            "newUserConnected",
            generateMessage("Admin", `${params.name} has joined`)
          );
        callback();
      }
    });

    // emitting a new text message
    // socket.emit("newMessage", {
    //   from: "Server",
    //   message: "This is the message",
    //   createdAt: new Date().getTime()
    // });

    // on recieving a create message we have to emit an event that all will
    // catch
    // client will emit this event when it will connect

    // socket.on("newConnected", () => {
    //   console.log("again connected");
    //   //   socket.emit(
    //   //     "welcomeConnected",
    //   //     generateMessage("Admin", "Welcome to chat App")
    //   //   );
    //   //   socket.broadcast.emit(
    //   //     "newUserConnected",
    //   //     generateMessage("Admin", "New User Connected")
    //   //   );
    //   // });
    // });
    socket.on("createMessage", (data, callback) => {
      callback();
      var usr = users.getUser(socket.id);
      if (usr && isRealString(data.text)) {
        //this will emit a event to all
        socket.emit("myMessage", generateMessage(usr.name, data.text , usr.initials) , ()=> console.log('Acknowledged'));
        socket.broadcast
          .to(usr.room)
          .emit("newMessage", generateMessage(usr.name, data.text , usr.initials));
        // Instead of doing this we will use broadcast to broadcast
        // an event to all but a specified socket(user)
        // socket.broadcast.emit("newMessage", {
        //   from: data.from,
        //   text: data.text,
        //   createdAt: new Date().getTime()
        // });
      } else {
      }
    });
    socket.on("createLocationMessage", (coords) => {
      var usr = users.getUser(socket.id);
      if (usr) {
        io.to(usr.room).emit(
          "newLocationMessage",
          generateLocationMessage(usr.name, coords.latitude, coords.longitude)
        );
      }
    });

    // on disconnect
    socket.on("disconnect", () => {
      console.log("Client Disconnected");
      var usr = users.removeUser(socket.id);
      if (usr) {
        io.to(usr.room).emit("updateUserList", users.getUserList(usr.room));
        io.to(usr.room).emit(
          "newUserConnected",
          generateMessage("Admin", `User : ${usr.name} left the room`)
        );
      }
    });
  });
};
