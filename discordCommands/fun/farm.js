exports.run = function (client, message, args, dbu, dbg) {
  dbu.findOne({discordId: message.author.id}, async function(err, found) {
    if(err) {
      return; //un problème avec la base de données
    }
    if (found) { //utilisateur déjà membre de liberty of world ou d'un de ses serveurs
      var gain = Math.floor(Math.random() * (100 + 130 + 1)) -130;
      if(gain>=0) message.channel.send("💴 Tu gagnes **"+gain+"** iC.");
      if(gain<0) message.channel.send("👹 Tu perds **"+(-gain)+"** iC, pas de bol.");
      if(found.balance>=0 && found.balance+gain<0){
        message.channel.send("😩 Oh mince, ton compte est dans le négatif.\nTu as **"+(-1*(found.balance+gain))+"** iC de dettes.")
      } else if(found.balance <0 && found.balance+gain >=0) {
        message.channel.send("🎉 Bravo, tu as payé tes dettes !\nTu as maintenant **"+(found.balance+gain)+"** iC")
      } else if(found.balance+gain < 0) {
        message.channel.send("Tu as encore **"+(-1*(found.balance+gain))+"** iC de dettes.");
      
      } else if(found.balance+gain >= 0) {
        message.channel.send("Tu as **"+(found.balance+gain)+"** iC en poche.")
      }
      if(gain<0) {
        let muterole = message.guild.roles.find(role => role.name === 'Muted');
        if (muterole) {
          message.member.addRole(muterole);
          message.channel.send("😈 "+message.member.user.username+ ' a été mute 1 minute pour son audace, mwhahahaha !')
        } else {
          var botMember = message.guild.members.find(memb=>memb.id==client.user.id);
          message.guild.createRole({name: "Muted", permissions:0, position:botMember.highestRole.position-2}).then((role) => {
            message.guild.channels.filter(channel => channel.type === 'category').forEach(channel => {
              channel.overwritePermissions(role, {
                SEND_MESSAGES: false
              })
            })
            message.member.addRole(role)
            message.channel.send("😈 "+message.member.user.username+' a été mute 1 minute pour son audace, mwhahahaha !')
          })
        }
        setTimeout(()=>{
          message.member.removeRole(muterole);
        },60000);
      }
      
      
      
      
      found.balance += gain;
      await found.save();
      
    } else { //nouveau
      message.channel.send("❌ Tu dois être une utilisateur enregistré pour utiliser cette commande !\nDemande à un membre du staff de t'aider.");
    }
  });
};

exports.data = {
  title: "farm",
  args: "",
  desc: "Essayer de gagner des iCrédits mais en perdre au final."
};