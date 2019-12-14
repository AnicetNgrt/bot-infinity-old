exports.run = function (client, message, args, dbu, dbg) {
  if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send(" Autorisations insuffisantes, seuls les élus peuvent faire ça :cry: ")
  let member = message.mentions.members.first()
  if (!member) return message.channel.send("Membre introuvable")
  //if (member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition && message.author.id !== message.guild.ownerID) return message.channel.send("Vous ne pouvez pas unmute ce membre.");
  if (member.highestRole.calculatedPosition >= message.guild.me.highestRole.calculatedPosition || member.id === message.guild.ownerID) return message.channel.send(" Je ne peux pas unmute ce membre il est trop puissant pour moi dsl :confused: ")
  let muterole = message.guild.roles.find(role => role.name === 'Muted')
  if (muterole && member.roles.has(muterole.id)) member.removeRole(muterole)
  message.channel.send(member + ' a été unmute :white_check_mark:')
};

exports.data = {
  title: "unmute",
  args: " <mention utilisateur>",
  desc: "Motus bouche cousue ! Ah, non plus maintenant."
};