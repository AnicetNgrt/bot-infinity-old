exports.run = function (client, message, args, dbu, dbg) {
  if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send( " Autorisations insuffisantes, seuls les élus peuvent faire ça :cry: " )
  let member = message.mentions.members.first()
  if (!member) return message.channel.send( "Membre introuvable" )
  if (member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition && message.author.id !== message.guild.ownerID) return message.channel.send ("Vous ne pouvez pas mute cet utilisateur :rolling_eyes: ");

  if (member.highestRole.calculatedPosition >= message.guild.me.highestRole.calculatedPosition || member.id === message.guild.ownerID) return message.channel.send(" Je ne peux pas mute ce membre, il est trop puissant pour moi dsl :confused: ")
  let muterole = message.guild.roles.find(role => role.name === 'Muted')
  if (muterole) {
    member.addRole(muterole)
    message.channel.send("Askip "+member.user.username+ ' a été mute :white_check_mark:')
  }
  else {
    var botMember = message.guild.members.find(memb=>memb.id==client.user.id);
    message.guild.createRole({name: "Muted", permissions:0, position:botMember.highestRole.position-1}).then((role) => {
      message.guild.channels.filter(channel => channel.type === 'text').forEach(channel => {
        channel.overwritePermissions(role, {
          SEND_MESSAGES: false
        })
      })
      member.addRole(role)
      message.channel.send("Askip "+member.user.username+' a été mute :white_check_mark:')
    })
  }
};

exports.data = {
  title: "mute",
  args: " <mention utilisateur>",
  desc: "C'est moi qui pose les questions ici"
};