///////////////////////////
// INITIALISATION DU BOT //
///////////////////////////

//tout ce dont le bot a besoin pour fonctionner

const Discord = require('discord.js'); //le code relatif à Discord
const fs = require('fs');              //Un module qui permet de manipuler les dossiers via le code
require('dotenv').config();          //Un module qui permet de cacher du public nos codes et tokens

const client = new Discord.Client();
var prefix ="?";
var blacklist = require('./data/blacklist.js');

//tout ce dont la base de données à besoin

const mongoose = require('mongoose');  //Module d'accès à la base de donnée
const Schema = mongoose.Schema;   
var Mixed = mongoose.Schema.Types.Mixed;   
var keydb = process.env.keydb;


var loServers = ["302928669767106580","525742744111415296","567106385515511828"];

// LISTE DES COMMANDES (si le nom d'une des commandes n'est pas dedans ça ne marchera pas)

const commands = {
  fun:["8ball","duel","farm","reply"],
  modération:["ban","kick","clear","mute","unmute","firewalloff","firewallon"],
  shop:["balance","additem","removeitem"],
  mongodb:["adduser","deleteallusers","refreshusers","removeusers","whitelist"],
  autres:["help","ping","rand","rebours"]
};


exports.run = function () {
  
  ////////////////////////////////
  // CODE DE LA BASE DE DONNEES //
  ////////////////////////////////
  
  mongoose
  .connect("mongodb+srv://admin:"+keydb+"@datacluster0-hvt2f.mongodb.net/test?retryWrites=true&w=majority", {useNewUrlParser:true})
  .then(() => console.log("Connecté à la base de données ! "))
  .catch(err => console.log(err));
  
  const LowUserSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: String,
    email: String,
    password: String,
    discordUsername: String,
    discordId: String,
    knownDiscordsId: [ String ],
    blacklisted: Boolean,
    warnCount: Number,
    balance: Number,
    inventory: {
      items: [String],
      count: [Number]
    },
    other:[String],
    blogposts:[Mixed]
  });

  const User = mongoose.model("LowUsers", LowUserSchema);
  
  const guildSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    id: String,
    ownerId: String,
    permInvite: String,
    trusted: Boolean,
    trust: Number,
    botUsage: Number,
    blacklist: [String],
    memberCount: Number,
    wantBlacklist: Boolean,
    items:[mongoose.Schema.Types.ObjectId]
  });
  
  const Guild = mongoose.model("LowGuilds", guildSchema);
  
  function createUser (a,b,c,d,e,f,g,h,i,j) {
    User.create({
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
      console.log('New user '+d+' created !')
    });
  }
  
  /////////////////
  // CODE DU BOT //
  /////////////////
  
  // quand le bot est lancé
  
  client.on('ready', function () {
    console.log('Bot connecté');
    client.user.setActivity('?help | '+client.guilds.array().length+' serveurs | code: Anicet_N et Mr_Rom', {type: "PLAYING"});

    /*Guild.find({},(err,list)=>{
      if(err) return;
      console.log(list);
      for (var i=0;i<list.length;i++) {
        list[i].items=[];
        list[i].save();
      }
    });*/
    
    for (var i=0; i<blacklist.length; i++) {
      User.findOne({discordId: blacklist[i]}, async function(err, found) {
        if(err) {
          return; //un problème avec la base de données
        }
        if (found) { //utilisateur déjà membre de liberty of world ou d'un de ses serveurs
          found.blacklisted = true;
          await found.save();

        } else { //nouveau
          createUser("ooo","ooo","ooo","ooo",blacklist[i],[],true,0,100,{items:[],count:[]});
        }
      });
    }
    
  }); 
  
  // quand un nouvel utilisateur rejoint le serveur
  
  client.on('guildMemberAdd' , async member =>{
    
    function serverWantsBl(){
      return new Promise((resolve,reject)=>{
        Guild.findOne({id:member.guild.id}, async function(err, found){
          if(err) return;
          if(found) {
            if (found.wantBlacklist == true) {
              resolve(true);
            } else {
              resolve(false);
            }
          }
        });
      });
    }
    if(member.guild.id == "302928669767106580") {
      console.log("ok");
      var already = await member.roles.find(role=>role.id=="604747665800036352"); 
      if (already) return;
      
      var adminChan = await member.guild.channels.find(chan => chan.id == "605512357669765150");
      var verifM = await adminChan.send(`**👉 Attention à <@&605493096188215369>: <@${member.user.id}> vient de rejoindre.\n✅ Valider l'utilisateur\n❌ Refuser l'utilisateur**`);
      verifM.react("✅");
      verifM.react("❌");
      var verifEmoji = async (reaction, user) => {
        if(reaction.message != verifM) return;
        memb = await member.guild.members.find(mem=>mem.user == user);
        v = await memb.roles.find(role=>role.id=="605493096188215369"); 
        if(v) {
          if(reaction.emoji == "✅" || reaction.emoji == "❌") {
            if (reaction.emoji == "✅") {
              member.removeRoles(["604747665800036352","584749560170283008"]);
              member.addRole("604757472158416915");
              adminChan.send("**Utilisateur vérifié ✅ par <@"+user.id+">**");
              client.removeListener('messageReactionAdd', verifEmoji);
            } else {
              adminChan.send("**Utilisateur refusé ❌ par <@"+user.id+">**");
              client.removeListener('messageReactionAdd', verifEmoji);
            }
          }
        }
      };
      client.on('messageReactionAdd', verifEmoji);
    }
    var wantBl = await serverWantsBl();
    
    User.findOne({discordId: member.user.id}, async function(err, found) {
      if(err) {
        return; //un problème avec la base de données
      }
      if (found) { //utilisateur déjà membre de liberty of world ou d'un de ses serveurs
        found.knownDiscordsId.push(member.guild.id);
        await found.save();
        if (wantBl == true && (found.blacklisted == true || blacklist.indexOf(member.user.id) != -1)) member.ban({reason:"Utilisateur ayant comme id:"+member.user.id+" blacklisté: ban automatique",days:1});
      } else { //nouveau
        if (blacklist.indexOf(member.user.id) != -1 && wantBl == true) {
          member.ban({reason:"Utilisateur ayant comme id:"+member.user.id+" blacklisté: ban automatique",days:1});
        }
        var nouveauRole = member.guild.roles.find(role => role.name === '💢 NOUVEAU');
        member.addRole(nouveauRole);

        setTimeout(()=>{
          member.removeRole(nouveauRole);
        }, 3600000);
        createUser("ooo","ooo","ooo",member.user.username,member.user.id,[member.guild.id],false,0,100,{items:[],count:[]}); 
      }
    });
    
  }); 
  
  client.on('guildCreate', guild=>{
 
    guild.channels.find(c=>c.type=="text").send("**Merci de m'avoir ajouté !**\n\nLe Préfixe : **?**\n\nFaites  : **?help pour voir mes commandes.**\n\nLes commandes de type **?ban | ?kick | ?mute et | ?clear** demandent les permissions  **| ban/kick/manage_message |**\n\nPour activer mon firewall, le propriétaire du serveur doit faire **?firewallOn**\n\nPour le désactiver c'est :  **?firewallOff**\n\n**Si vos membres font déjà partie de ma blacklist et que vous activez mon firewall, ils ne seront pas ban tout de suite. Mais si ils quittent et rejoignent votre serveur à nouveau, ils seront ban automatiquement, comme tous les utilisateurs de ma blacklist. Merci d'en prendre compte car je ne pourrai les retirer de ma blacklist.**\n\n**Votre dévoué serviteur,\nInfinity**");
    Guild.findOne({id:guild.id}, async function(err, found){
      if(err) {

        return; //un problème avec la base de données
      }
      if (found) { //serveur connu

      } else { //serveur inconnu
        var banList = await guild.fetchBans();
        var blacklist = [];
        var trusted = true;
        var trust = 10; var checkBanned;
        var toBl = [];
        
        for (var i=0; i<guild.members.array().length;i++) {  //vérifier si des utilisateurs du serveur sont blacklist
          checkBanned = () => {return new Promise((resolve,reject)=>{
            User.findOne({discordId:guild.members.array()[i].id}, async function(err, dbUser) {
              if(err) {
                
                return resolve(); //un problème avec la base de données
              }
              if (dbUser) { 
                
                if(dbUser.blacklisted == true )trust-=0.5; //utilisateur blacklisté qui n'est pas banni sur ce serveur       
                resolve();
              } else {
               
                createUser("ooo","ooo","ooo",guild.members.array()[i].user.username,guild.members.array()[i].id,[guild.id],false,0,100,{items:[],count:[]});
                toBl.push(dbUser);
                resolve();
              }
            });
          })};
          await checkBanned();
        }
        
   
        for (var i=0; i<banList.array().length;i++) { //vérifier si nos utilisateurs actifs sont ban sur leur serveur
          checkBanned = ()=>{return new Promise((resolve,reject)=>{
            User.findOne({discordId:banList.array()[i].id}, async function(err, dbUser) {
              if(err) {
                return resolve(); //un problème avec la base de données
              }
              if (dbUser) { //utilisateur connu qui est banni sur ce serveur
                if (dbUser.blacklisted == false && dbUser.balance == 100) { //banni et pas actif chez nous
                  trust -= 1;
                } else if(dbUser.blacklisted == false && dbUser.balance >= 100) {//banni et actif chez nous
                  trust -= 3;
                } else if(dbUser.blacklisted == true) {//banni chez eux et chez nous
                  trust += 0.1;
                }
                toBl.push(dbUser);
                resolve();
                
              } else {//banni chez eux et inconnu au bataillon
                
                createUser("ooo","ooo","ooo","ooo",banList.array()[i].id,[guild.id],false,0,100,{items:[],count:[]});
                setTimeout(()=>{
                  User.findOne({discordId:banList.array()[i].id}, async function(err, dude) {
                    if (dude) {
                      toBl.push(dude);
                    }
                    resolve();      
                  });
                },1000);
                
              }
            }); 
          })};        
          await checkBanned();
          blacklist.push(banList.array()[i].id);
        }
        
        console.log("trust:"+trust);
        
        console.log(toBl.length);
        
        if (trust >= 8.5) {
          for (var i in toBl) {
            if (toBl[i].balance != undefined && (toBl[i].balance == 100 && toBl[i].blacklisted == false)) {
              console.log(toBl[i].discordId+" blacklisted");
              toBl[i].blacklisted = true;
              toBl[i].save();
            }
          }
        }

        function getGlobalItems () {
          return new Promise((resolve,reject)=>{
            Item.find({global:true},(err,found)=>{
              if (err) return;
              if(found){
                var ids = [];
                for(var i in found){
                  ids.push(found[i]._id);
                }
                resolve(ids);
              } else {
                resolve([]);
              }
            });
          });
        }
        var itemsIds = await getGlobalItems();
        
        Guild.create({
          _id: new mongoose.Types.ObjectId(),
          name: guild.name,
          id: guild.id,
          ownerId:guild.ownerID,
          permInvite: "unknown",
          trusted: trusted,
          trust: trust,
          botUsage: 0,
          blacklist: blacklist,
          memberCount: guild.memberCount,
          wantBlacklist: false,
          items: itemsIds
        }, function (err) {
          if(err) console.log(err);
          console.log('New guild '+guild.name+' registered !')
        });
      }
      
    });
  });
  
  client.on('guildBanAdd', (guild, user)=>{
    Guild.findOne({id:guild.id}, async function(err, dbg){
      if(err) {
        return; //un problème avec la base de données
      }
      if (dbg) {
        if (dbg.trusted == true) {
          User.findOne({discordId: user.id}, async function(err, found) {
            if(err) {
              return; //un problème avec la base de données
            }
            if (found && (loServers.indexOf(guild.id) == -1 || (found.knownDiscordsId.indexOf(loServers[0]) != -1 && found.knownDiscordsId.indexOf(loServers[1]) != -1  && found.knownDiscordsId.indexOf(loServers[2]) != -1))) { //utilisateur déjà membre de liberty of world ou d'un de ses serveurs
              found.blacklisted = true;
              await found.save();
            } else { //nouveau
              createUser("ooo","ooo","ooo",user.username,user.id,[guild.id],true,0,100,{items:[],count:[]});
            }
          });
        }
      }
    });
  });
  client.on('guildBanRemove', (guild, user)=>{
    Guild.findOne({id:guild.id}, async function(err, dbg){
      if(err) {
        return; //un problème avec la base de données
      }
      if (dbg) {
        if (dbg.trusted == true) {
          User.findOne({discordId: user.id}, async function(err, found) {
            if(err) {
              return; //un problème avec la base de données
            }
            if (found) { //utilisateur déjà membre de liberty of world ou d'un de ses serveurs
              found.blacklisted = false;
              await found.save();
        
            } else { //nouveau
              createUser("ooo","ooo","ooo",user.username,user.id,[guild.id],false,0,100,{items:[],count:[]});
            }
          });
        }
      }
    });
  });
  client.on("guildMemberUpdate",(old,nouv)=>{
    var guild = old.guild;
    var testRole = guild.roles.find(role=>role.name=="Aucune Invitation ( 0 ) 😥");
    if (guild.roles.array().indexOf(testRole) == -1) return;
    var roles = [
      guild.roles.find(role=>role.name=="Aucune Invitation ( 0 ) 😥"),
      guild.roles.find(role=>role.name=="Débutant (5) 😶"),
      guild.roles.find(role=>role.name=="Amateur (15) 😏"),
      guild.roles.find(role=>role.name=="Explorateur (25) 🌍"),
      guild.roles.find(role=>role.name=="Businessman (40) 📊"),
      guild.roles.find(role=>role.name=="Ambassadeur ( 50+ )  🕵️")
    ];
    var found = -1;
    for (var i=0;i<roles.length-1;i++) {
      if (nouv.roles.array().indexOf(roles[i]) != -1 && nouv.roles.array().indexOf(roles[i+1]) != -1) {
        found = i;
        break;
      }
    }
    if (found == -1) return;
    if(found >= 0) nouv.removeRole(roles[found]);

  });
  
  
  // manipulateur des commandes
  
  client.on('message', message => {

    if(message.content.startsWith(prefix) == false) {
      var rmScript = require(`./events/randommoney.js`);
      rmScript.run(client,message,User);
      return;
    }
    var msgCmdContent = message.content.slice(1).trim().match(/(".*?"|[^"\s]+)+(?=\s*|\s*$)/g);
    var cmd = msgCmdContent[0].toLowerCase();
    var args = msgCmdContent.slice(1);
    let argsWithoutMentions = args.filter(arg => !Discord.MessageMentions.USERS_PATTERN.test(arg));
    
    let ct = "";

    for(var type of Object.keys(commands)) {
      if(commands[type].indexOf(cmd)!= -1) {
        ct = type;
        break;
      }
    }

    if(ct != "") {
      command = require("./discordCommands/"+ct+"/"+cmd+".js");
    } else {
      message.delete(5000);
      return message.channel.send("Cette commande n'existe pas.").then(m=>m.delete(5000));
    }    
    command.run(client, message, argsWithoutMentions, User, Guild);
  });

  /*client.on("guildMemberSpeaking", (member,speaking)=>{
    var guild = member.guild();
    afkChannel = guild.channels.find(c=>c.id=="584749637517312001");
    if (member.id == "383663459180740608" && speaking == true) {
      member.setVoiceChannel(afkChannel); 
    }
  }); */

};

exports.data = {
  titre: "Le super bot de Liberty of Worlds",
  commands: commands
};

//Code pour connecter le bot (éxécuté avant le code ci-dessus)

client.login(process.env.token);


//////////////////////////////////////////////
// ANCIENNES COMMANDES PAS ENCORE RAJOUTEES //
//////////////////////////////////////////////

//Message de Départ//

//client.on('guildMemberRemove' , member =>{
    //member.guild.channels.get('525742744111415298').send(':cry: **Cet endroit ne plaît pas à tout le monde : **' + member.user)
    //console.log('-1')//
//})

/*

//WARN//

client.on("message", message => {
    if (!message.guild) return
    let args = message.content.trim().split(/ +/g)

if (args[0].toLowerCase() === prefix + "warn") {

    if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send(" Autorisation insuffisante seul les élu peuvent faire ça :cry: ")
    let member = message.mentions.members.first()
    if (!member) return message.channel.send("Veuillez mentionner un membre")
    if (member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition && message.author.id !== message.guild.ownerID) return message.channel.send(" Je ne peux pas warn ce membre il est trop puissant pour moi dsl :confused: ")
    let reason = args.slice(2).join(' ')
    if (!reason) return message.channel.send("Veuillez indiquer une raison")
    if (!warns[member.id]) {
        warns[member.id] = []
    }
    warns[member.id].unshift({
        reason: reason,
        date: Date.now(),
        mod: message.author.id
    })
    fs.writeFileSync('./warns.json', JSON.stringify(warns))
    message.channel.send(member + " Askip il a été warn pour " + reason + " :white_check_mark:")
}

//Infractions// 

if (args[0].toLowerCase() === prefix + "infractions") {
    if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send(" Autorisation insuffisante seul les élu peuvent faire ça :cry: ")
    let member = message.mentions.members.first()
    if (!member) return message.channel.send("Veuillez mentionner un membre")
    let embed = new Discord.RichEmbed()
        .setAuthor(member.user.username, member.user.displayAvatarURL)
        .addField('7 derniers warns', ((warns[member.id] && warns[member.id].length) ? warns[member.id].slice(0, 10).map(e => e.reason) : "Ce membre n'a aucun warn"))
        .setTimestamp()
    message.channel.send(embed)
}

//Un_Warn//

if (args[0].toLowerCase() === prefix + "unwarn") {
    let member = message.mentions.members.first()
    if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send(" Autorisation insuffisante seul les élu peuvent faire ça :cry: ")
    if (!member) return message.channel.send("Membre introuvable")
    if (member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition && message.author.id !== message.guild.ownerID) return message.channel.send("Vous ne pouvez pas unwarn ce membre.")
    if (member.highestRole.calculatedPosition >= message.guild.me.highestRole.calculatedPosition || member.id === message.guild.ownerID) return message.channel.send(" Je ne peux pas unmute ce membre il est trop puissant pour moi dsl :confused: ")
    if (!warns[member.id]|| !warns[member.id].length) return message.channel.send("Ce membre n'a actuellement aucun warns.")
    warns[member.id].shift()
    fs.writeFileSync('./warns.json', JSON.stringify(warns))
    message.channel.send("Le dernier warn de " + member + " a été retiré :white_check_mark:")
}

})

*/
