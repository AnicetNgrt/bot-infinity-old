
exports.run = function (client, message, args, dbu, dbg) {
  dbu.findOne({discordId: message.author.id}, async function(err, found) {
    if(err) {
      return; //un problème avec la base de données
    }
    if (found) { //utilisateur déjà membre de liberty of world ou d'un de ses serveurs
      if(found.balance <= 100) {
        message.channel.send("Tu ne peux pas créer une page de blog");
      }
    } else { //nouveau
      
    }
  });
  
  message.channel.send("Utilisateur dé-blacklisté");
  
};

exports.data = {
  title: "whitelist",
  args: " <id discord>",
  desc: "Retirer quelqu'un de la blacklist."
};