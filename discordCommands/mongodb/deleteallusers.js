const mongoose = require('mongoose'); 

exports.run = function (client, message, args, dbu, dbg) {
  if(message.author.id != "271248632571756544") return;
  var guild = message.guild;
  
  var membersArray = guild.members.array();
  for (var i = 0; i < membersArray.length; i++) {
    let member = membersArray[i];
    dbu.deleteOne({discordId: member.user.id}, function (err) {
      if (err) return;
      console.log("Le compte de "+member.user.username+" a été supprimé.");
    });
  }
  
};

exports.data = {
  title: "deleteAllUsers",
  args: "",
  desc: "supprime tous les comptes LOW des utilisateurs du serveur"
};