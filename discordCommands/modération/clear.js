exports.run = function (client, message, args, dbu, dbg) {
  if (!message.member.hasPermission('MANAGE_MESSAGES') && message.author.id != "271248632571756544") return message.channel.send( " Autorisations insuffisantes, seuls les élus peuvent faire ça :cry: " )
  let count = args[0];
  if (!count) return message.channel.send( " Veuillez indiquer le nombre de messages à supprimer." );
  if (isNaN(count)) return message.channel.send("Veuillez indiquer un nombre valide");
  if (count <1 || count > 99) return message.channel.send( "Veuillez indiquer un nombre entre 1 et 99" );
  message.channel.bulkDelete(parseInt(count) + 1)
};

exports.data = {
  title: "clear",
  args: " <nbr de messages>",
  desc: "Nettoie moi tout ça fissa"
};