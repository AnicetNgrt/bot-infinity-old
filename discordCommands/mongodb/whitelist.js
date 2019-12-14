exports.run = function (client, message, args, dbu, dbg) {
  if (!message.member.hasPermission('BAN_MEMBERS')) return message.channel.send(" Autorisations insuffisantes, seuls les élus peuvent faire ça :cry: ")
  let id= args[0];
  
  dbu.findOne({discordId: id}, async function(err, found) {
    if(err) {
      return; //un problème avec la base de données
    }
    if (found) { //utilisateur déjà membre de liberty of world ou d'un de ses serveurs
      found.blacklisted = false;
      found.save();
    } else { //nouveau
      return;
    }
  });
  
  message.channel.send("Utilisateur dé-blacklisté");
  
};

exports.data = {
  title: "whitelist",
  args: " <id discord>",
  desc: "Retirer quelqu'un de la blacklist."
};