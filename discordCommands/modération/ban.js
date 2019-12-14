exports.run = function (client, message, args, dbu, dbg) {
  if (!message.member.hasPermission('BAN_MEMBERS')) return message.channel.send(" Autorisations insuffisantes, seuls les élus peuvent faire ça :cry: ")
  let member = message.mentions.members.first()
  if (!member) return message.channel.send(" Veuillez mentionner un utilisateur :x: ")
  if (member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition && message.author.id !== message.guild.owner.id) return message.channel.send(" Vous ne pouvez pas ban cette utilisateur ")
  if (!member.bannable) return message.channel.send(" Je ne peux pas bannir cet utilisateur, il est trop puissant pour moi dsl :confused: ")
  let count = args[0];
  if (!count) return message.channel.send( " Veuillez indiquer le nombre de jours de bannissement." );
  if (isNaN(count)) return message.channel.send("Veuillez indiquer un nombre de jours valide");
  dbu.findOne({discordId: member.id}, async function(err, found) {
    if(err) {
      return; //un problème avec la base de données
    }
    if (found) { //utilisateur déjà membre de liberty of world ou d'un de ses serveurs
      for(var i=0; i<found.knownDiscordsId.length;i++) {
        let guild = await client.guilds.find(g => g.id == found.knownDiscordsId[i]);
        guild.ban(member.user, {years:(parseInt(count)%365)+1,months:(parseInt(count)%30)+1, days: (parseInt(count)%7)+1 });
      }
      found.blacklisted = true;
      found.save();
      setTimeout(()=>{
        found.blacklisted = false;
        found.save();
      },parseInt(count)*3600000);
    } else { //nouveau
      message.guild.ban(member, {years:(parseInt(count)%365)+1,months:(parseInt(count)%30)+1, days: (parseInt(count)%7)+1 });
    }
  });
  
  message.channel.send("Askip "+member.user.username+' a été ban + :white_check_mark: ')
  
};

exports.data = {
  title: "ban",
  args: " <mention utilisateur>",
  desc: "Adieu"
};