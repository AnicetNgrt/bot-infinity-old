const mongoose = require('mongoose'); 

exports.run = function (client, message, args, dbu, dbg) {
  if(message.author.id != "271248632571756544") return;
  let member = message.mentions.members.first();
  
  function createUser (a,b,c,d,e,f,g,h,i,j) {
    dbu.create({
      _id: new mongoose.Types.ObjectId(),
      username: a,
      email: b,
      password: c,
      discordUsername: d,
      discordId: e,
      knownDiscordsId: f,
      blacklisted: g,
      warnCount: h,
      balance: i,
      inventory: j,
      other: []
    }, function (err) {
      message.channel.send(d+" d'id discord: "+e+" a été ajouté.");
    });
  }
  
  dbu.findOne({discordId: member.user.id}, function(err, found) {
    if(err) {
      return; //un problème avec la base de données
    }
    if (found) { //utilisateur déjà membre de liberty of world ou d'un de ses serveurs
      message.channel.send("Utilisateur déjà existant");
    } else { //nouveau
      createUser(args[0],args[1],args[2],member.user.username,member.user.id,[member.guild.id],false,0,100,{items:[],count:[]});
    }
  });
};

exports.data = {
  title: "addUser",
  args: "",
  desc: "adds an user"
};