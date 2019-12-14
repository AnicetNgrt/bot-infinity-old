const mongoose = require('mongoose');

exports.run = function (client, message, args, dbu, dbg) {
  
  if(message.author.id != "271248632571756544") {
    message.channel.send("Tu n'as pas l'autorisation");
    return
  }
  var member = message.mentions.members.first();
  
 
  
  dbu.deleteOne({discordId: member.user.id}, function (err) {
      if (err) return;
      message.channel.send("Utilisateur supprimé ❎");
    });
};

exports.data = {
  title: "removeUser",
  args: "",
  desc: "removes an user"
};