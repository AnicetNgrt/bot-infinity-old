exports.run = function (client, message, args, dbu, dbg) {
  if (!message.member.hasPermission('KICK_MEMBERS')) return message.channel.send(" Autorisations insuffisantes, seuls les élus peuvent faire ça :cry: ");
  let member = message.mentions.members.first();
  if (!member) return message.channel.send(" Veuillez mentionner un utilisateur :x: ");
  if (member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition && message.author.id !== message.guild.owner.id) return message.channel.send(" Vous ne pouvez pas kick cette utilisateur ");
  if (!member.kickable) return message.channel.send(" Je ne peux pas kick cet utilisateur il est trop puissant pour moi dsl :confused:  ");
  member.kick();
  message.channel.send(member.user.username + ' a pris la porte :white_check_mark: ');
};

exports.data = {
  title: "kick",
  args: " <mention utilisateur>",
  desc: "Je suis où ? Pas là."
};


