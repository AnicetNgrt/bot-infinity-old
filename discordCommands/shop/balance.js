exports.run = function (client, message, args, dbu, dbg) {
  dbu.findOne({discordId: message.author.id}, async function(err, found) {
    if(err) {
      return; //un problème avec la base de données
    }
    if (found) { //utilisateur déjà membre de liberty of world ou d'un de ses serveurs
      if(found.balance<0) {
        message.channel.send("🗃 Tu as **"+(-found.balance)+"** iC de dettes.")
      } else if(found.balance>=0) {
        message.channel.send("👛 Tu as **"+found.balance+"** iC en poche.")
      }
      
    } else { //nouveau
      message.channel.send("❌ Tu dois être une utilisateur enregistré pour utiliser cette commande !\nDemande à un membre du staff de t'aider.")
    }
  });
};

exports.data = {
  title: "balance",
  args: "",
  desc: "Vous dit combien vous avez de iCrédits."
};