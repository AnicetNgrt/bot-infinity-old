const fs = require('fs');  
var commands = {
  fun:["8ball","duel","farm","reply"],
  modération:["ban","kick","clear","mute","unmute","firewalloff","firewallon"],
  shop:["balance","additem","removeitem"],
  autres:["help","ping","rand","rebours"]
};

function timer (s) {
  return new Promise((resolve,reject)=>{
    setTimeout(()=>{
      resolve();
    },s*1000);
  });
}

exports.run = async function (client, message, args, dbu, dbg) {
  let text = "";
  if(args[0] != undefined) { //specific
    let ct = "";

    for(var type of Object.keys(commands)) {
      if(commands[type].indexOf(args[0])!= -1) {
        ct = type;
        break;
      }
    }

    if(ct != "") {
      command = require("../"+ct+"/"+args[0]+".js");
      text+="`?"+command.data.title+command.data.args+"` : "+command.data.desc;
    }
    message.channel.send(text);

  } else { //all commands

    for(var type of Object.keys(commands)) {
      text+="➖➖➖➖➖➖➖➖➖➖➖\n**"+type.toUpperCase()+"**\n";
      for(var cmd of commands[type]) {
        command = require("../"+type+"/"+cmd+".js");
        text+="`?"+command.data.title+command.data.args+"` : "+command.data.desc+"\n";
      }
      message.channel.send(text).then(m=>m.delete(120000));
      await timer(0.5);
      text = "";
    }
  }
  

};

exports.data = {
  title: "help",
  args: " <facultatif: nom de la commande>",
  desc: "Avoir la liste des commandes ou de l'aide pour une commande en particulier."
};