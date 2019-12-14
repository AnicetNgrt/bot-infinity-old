exports.run = function (client, message, args, dbu, dbg) {
  message.channel.send("pong");
};

exports.data = {
  title: "ping",
  args: "",
  desc: "Pong"
};