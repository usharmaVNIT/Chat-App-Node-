var socket = io();

// function scrollToBottom() {
//   var messages = jQuery("#showMessages");
//   var newMessage = messages.children("div:last-child");
//   console.log(newMessage);
//   var newMessageHeight = newMessage.innerHeight();
//   var lastMessageHeight = newMessage.prev().innerHeight();

//   var clientHeight = messages.prop("clientHeight");
//   var scrollTop = messages.prop("scrollTop");
//   var scrollHeight = messages.prop("scrollHeight");
//   if (
//     clientHeight + scrollTop + newMessageHeight + lastMessageHeight >=
//     scrollHeight
//   ) {
//     console.log("scroll");
//     messages.scrollTop(scrollHeight);
//   }
// }

socket.on("connect", function () {
  console.log("connected to server");

  var params = jQuery.deparam(window.location.search);

  socket.emit("join", params, function (err) {
    if (err) {
      alert(err);
      window.location.href = "/";
    } else {
      console.log("No Error");
    }
  });
});

socket.on("disconnect", function () {
  console.log("Disconnected from server");
});

socket.on("updateUserList", function (users) {
  const div = jQuery("<div></div>");
  const template = jQuery("#userAddTemplate").html();
  users.forEach((user) => {
    var html = Mustache.render(template, {
      name: user.name,
      initials: user.initials
    });
    div.append(html);
  });
  jQuery("#contacts").html(div);

  const temp2 = jQuery("#roomName").html();
  var ht2 = Mustache.render(temp2, {
    room: users[0].room
  });
  jQuery('#roomNameRender').html(ht2);

});

socket.on("welcomeConnected", (data) => {
  var formattedTime = moment(data.createdAt).format("h:mm a");
  const template = jQuery("#admin-notification").html();
  var html = Mustache.render(template, {
    from: data.from,
    text: data.text,
  });
  jQuery("#showMessages").append(html);
  // scrollToBottom(document.getElementById('showMessages'));
  scrollToBottom(document.getElementById('content'));
});

socket.on("newUserConnected", (data) => {
  var formattedTime = moment(data.createdAt).format("h:mm a");
  const template = jQuery("#admin-notification").html();
  var html = Mustache.render(template, {
    from: data.from,
    text: data.text,
  });
  jQuery("#showMessages").append(html);
  // scrollToBottom(document.getElementById('showMessages'));
  scrollToBottom(document.getElementById('content'));
});

socket.on("newMessage", function (data) {
  console.log("New Message", data);
  var formattedTime = moment(data.createdAt).format("h:mm a");
  var template = jQuery("#message-template").html();
  var html = Mustache.render(template, {
    text: data.text,
    name: data.from,
    initials: data.initials,
    createdAt: formattedTime
  });
  jQuery("#showMessages").append(html);
  // scrollToBottom(document.getElementById('showMessages'));
  scrollToBottom(document.getElementById('content'));

  // var li = jQuery("<li></li>");
  // li.text(`${data.from} : ${data.text} - ${formattedTime}`);
  // jQuery("#messages").append(li);
});

socket.on("myMessage", function (data, callback) {
  var formattedTime = moment(data.createdAt).format("h:mm a");
  var template = jQuery("#my-message-template").html();
  var html = Mustache.render(template, {
    text: data.text,
    from: "me",
    createdAt: formattedTime,
    initials: data.initials
  });
  jQuery("#showMessages").append(html);
  callback();
  // scrollToBottom(document.getElementById('showMessages'));
  scrollToBottom(document.getElementById('content'));
});

jQuery("#message-form").on("submit", function (e) {
  e.preventDefault();
  var messages_bar = jQuery("[name=type-message]");
  socket.emit(
    "createMessage",
    {
      text: messages_bar.val()
    },
    function () {
      messages_bar.val("");
    }
  );
});
