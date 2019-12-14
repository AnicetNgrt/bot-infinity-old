const mongoose = require('mongoose'); 

exports.run = function (client, message, args, dbu, dbg) {
  if(message.author.id != "271248632571756544") return;
  var guild = message.guild;
  
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
      other: [],
      blogposts: []
    }, function (err) {
      console.log(d+" d'id discord: "+e+" a été ajouté.");
    });
  }
  
  var membersArray = guild.members.array();
  for (var i = 0; i < membersArray.length; i++) {
    let member = membersArray[i];
    dbu.findOne({discordId: member.user.id}, function(err, found) {
      if(err) {
        return; //un problème avec la base de données
      }
      if (found) { //utilisateur déjà membre de liberty of world ou d'un de ses serveurs
        return;
      } else { //nouveau
        createUser("ooo","ooo","ooo",member.user.username,member.user.id,[guild.id],false,0,100,{items:[],count:[]});
      }
    });
  }
  
};

exports.data = {
  title: "refreshUser",
  args: "",
  desc: "crée un compte pour tous les non-enregistrés du serveur"
};