const Item = require("../../data/items.js");

const mongoose = require('mongoose');  //Module d'accès à la base de donnée

exports.run = function (client, message, args, dbu, dbg) {
  if(message.author.id != message.guild.owner.id && message.author.id != "271248632571756544") {
    return message.channel.send("Commande réservée au propriétaire du serveur et au créateur du bot.");
  }
  message.delete();
  Item.findOne({_id:args[0]}, (err,found)=>{
    if(err) return err;
    if (found) {
        dbu.find({},(err,users)=>{
            if(err) return;
            if(users) {
                for(var i=0;i<users.length;i++) {
                  
                  if(users[i].inventory.items.indexOf(args[0])!=-1) {
                      
                      let index = users[i].inventory.items.indexOf(args[0]);
                      users[i].inventory.items.splice(index,1);
                      users[i].inventory.count.splice(index,1);
                      users[i].save();
                      
                  }
                }
            }
        });
      dbg.find({},(err,guilds)=>{
        if(err) return;
        for(var i=0;i<guilds.length;i++) {
          if(guilds[i].items.indexOf(args[0]) != -1) {
            let index = guilds[i].items.indexOf(args[0]);
            guilds[i].items.splice(index,1);
            guilds[i].save();
          }
        }
      });
      found.remove();
      return message.channel.send("✅ Item supprimé sur tous les serveurs qui le possèdent.");
    } else {
      return message.channel.send("Il semble que cet item n'existe pas du tout.");
    }
  });
};

exports.data = {
  title: "removeitem",
  args: " <id de l'item (envoyé en mp à l'owner lors de sa création)> ",
  desc: "Retirer un item de ce serveur."
};