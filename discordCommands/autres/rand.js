exports.run = function (client, message, args, dbu, dbg) {
  if (args[0] == undefined || args[1] == undefined) return message.channel.send("Veuillez indiquer un min et un max");
  var nbr = Math.floor(Math.random() * (parseInt(args[0]) - parseInt(args[1]) + 1)) + parseInt(args[1]);
  if (isNaN(nbr)) return message.channel.send("Veuillez indiquer un nombre min et un nombre max valides.");
  message.channel.send("Nombre: "+nbr);
};

exports.data = {
  title: "rand",
  args: " <min> <max>",
  desc: "Nombre aléatoire entre <min> et <max> inclu ex:`rand 0 10`: nombre entre 0 et 10."
};