exports.run = function (client, message, args, dbu, dbg) {
  message.channel.send(args[0].replace(/['"]+/g, '')+"\n||<@"+message.author.id+">||");
};

exports.data = {
  title: "reply",
  args: " <message (entre guillemets)>",
  desc: "Ordonner au bot de dire quelque chose."
};