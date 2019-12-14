// là je fais mon kiff, on verra bien ce que ça donne.
const { RichEmbed } = require('discord.js');

var div = "➖➖➖➖➖➖➖➖➖";

var tirades = {
  engager:["Wow, p1 engage p2 en duel, à vos popcorns !","Il semblerait que p1 ait perdu son sang froid ! p2 a du souci à se faire.",
           "p1 engage un duel ! Est-ce que p2 sera à la hauteur ?","Mes prognostics indiquent que p1 va se faire laminer, mais bon, c'est sa faute si il a engagé p2 en duel.",
          "Attention mesdames et messieurs, le duel entre p1 et p2 va commencer ! Le spectacle sera à couper le souffle !","p1 engage p2 en duel ! En 20 ans de carrière je n'ai jamais vu un match avec autant de balls !",
          "Si j'étais parmi vous cher public je m'éloignerai un petit peu, car le duel entre p1 et p2 va faire des émeules.","Oh non ! Ils recommencent ! La dernière fois que p1 a affronté p2 il y a eu 50 victimes collatérales dans le public !"],
  debut:["C'est inoui ! p1 envoie une attaque ! Je la reconnais, elle s'appelle...","Incroyable, p1 attaque avec rage ! Cette attaque semble surpuissante, comment s'appelle-t-elle ?","Attention, on sait que ça va faire mal quand p1 utilise sa technique secrète qui s'appelle..."],
  attaques:["Technique du crabe","Frapper là où ça fait mal","Coup de couteau dans le dos","Psychose","Souffle enflammé","Pluie de drones","Poison mortel","Technique du phacochère"],
  dSuccess:["Wow, ça fait mal à p2 !"],
  dFail:["Oh, p1 nous déçois un peu là dessus, ce n'est pas très efficace contre p2..."],
  dBigSuccess:["Incroyable, c'est SUPER EFFICACE !"],
  dBigFail:["Nooon, p1 a totalement raté son coup... c'est dommage !"],
  sGif:["https://tenor.com/view/saitama-one-punch-man-gif-4973550","https://tenor.com/view/neon-genesis-evangelion-laser-anime-gif-14140161","https://media2.giphy.com/media/HOX80nO0h8Na/giphy.gif","http://66.media.tumblr.com/0bb4b7ee30826d8f721a923c65072fd1/tumblr_mhdrmnfDxi1rjy2z6o1_400.gif","http://66.media.tumblr.com/77d22b6d2e5568a29633288997c510dc/tumblr_mxerhnMhZ71s20ivko1_500.gif","https://66.media.tumblr.com/8afa9297abb9a41bd15ae56b2a7de190/tumblr_orceu91GHU1u9t5z9o1_400.gif","https://media3.giphy.com/media/Ig2GpnKDMMAV2/giphy.gif","https://giant.gfycat.com/ExhaustedFrequentArrowana.webm","https://66.media.tumblr.com/043296378155d0ac7fa386538d4f5786/tumblr_olr40qxxuL1w4oiizo1_640.gif","https://pa1.narvii.com/5778/69f4fac374e23056224dbaa16471a5155c23a75d_hq.gif","https://media.giphy.com/media/wYSIRWB1eFjJm/giphy.gif","https://media2.giphy.com/media/28hH1I85TCZosy5zus/giphy.gif","https://thumbs.gfycat.com/InsistentPeriodicHectorsdolphin-max-1mb.gif","https://i.gifer.com/1L3K.gif","https://media.giphy.com/media/6GCoYzxRIQ6zK/giphy.gif","https://media0.giphy.com/media/2KqusoYr1zRzq/giphy.gif"],
  fGif:["https://i.gifer.com/3iYt.gif","https://media1.giphy.com/media/3o7btQ9ep8sZXmfFra/giphy.gif","http://pa1.narvii.com/5830/dddaa6cb8a6b80fb7fcee3f67cb18765ee7b3d0b_hq.gif","https://media3.giphy.com/media/H34rQ4oK9RWBRkQupI/giphy.gif"],
  pAttGif:["https://media0.giphy.com/media/l0Iye29H39h7qVbgY/giphy.gif","https://i.imgur.com/F26pgnu.gif","https://media.giphy.com/media/bEH6uQUUVFWpjETjYa/giphy.gif","https://media3.giphy.com/media/136CHzni1HrKzm/giphy.gif","https://i.pinimg.com/originals/d4/e1/c6/d4e1c68148264e6e6bd7c11f7a71d52c.gif","https://media.giphy.com/media/1J4X5chVxtBFS/giphy.gif","https://media.giphy.com/media/mcBPoWoPJbAuk/giphy.gif","https://media.giphy.com/media/wMQiwQaolQAWQ/giphy.gif"]
}

//fonction mathématique qui donne un entier aléatoire selon une loi normale (courbe en cloche)
function normal(mu, sigma, nsamples){
    if(!nsamples) nsamples = 6
    if(!sigma) sigma = 1
    if(!mu) mu=0

    var run_total = 0
    for(var i=0 ; i<nsamples ; i++){
       run_total += Math.random()
    }

    return sigma*(run_total - nsamples/2)/(nsamples/2) + mu
}

//fonction pour attendre un certain temps
function timer (s) {
  return new Promise((resolve,reject)=>{
    setTimeout(()=>{
      resolve();
    },s*1000);
  });
}

//fonction pour attendre un message selon certains critères
function am (users,channel,content,type,count,time,tfail,del) {
  return new Promise((resolve,reject)=>{
    const filter = m => {
      var first = false;
      switch(type) {
        case "inclusive":
          if (m.content.includes(content)) first = true;
          break;
        case "exclusive":
          if (m.content.trim() == content) first = true;
          break;
        case "start":
          if (m.content.startsWith(content)) first = true;
          break;
        case "finish":
          if (m.content.trim().endsWith(content)) first = true;
          break;
        case "any":
          first = true;
          break;
      }
      if(del == true && m.channel == channel) {
        m.delete(5000);
      }
      if(users.indexOf(m.author) != -1 && first) m.react("✔");
      return (users.indexOf(m.author) != -1 && first);
      
    };
    channel.awaitMessages(filter, { max: count, time: time, errors: ['time'] })
      .then(collected => resolve(collected))
      .catch(collected => {
        if(!tfail) resolve(collected);
        if(tfail) resolve(false);
      });
  });
}

//déroulement du duel
exports.run = async function (client, message, args, dbu, dbg) {
  message.delete(3000);
  var p2M = message.mentions.members.first();
  var p2 = message.mentions.members.first().user;
  if (!p2) return message.channel.send("Veuillez mentionner un utilisateur que vous voulez affronter :x: ").then(m=>{m.delete(5000)});
  if (p2.bot && p2!=client.user) return message.channel.send("❌ Tu ne peux pas engager un bot en duel, ce sont des tricheurs de toute façon."+"\n"+div).then(m=>{m.delete(5000)});
  if (p2 == client.user) message.channel.send("🤖 Je te déconseille fortement, tu risques de perdre... \nMais soit... *~MEURS DANS D'ATROCES SOUFFRANCES PAUVRE FOU !~*\nMwahahaha"+"\n"+div).then(m=>{m.delete(5000)});
  let noduelRole = message.guild.roles.find(role => role.name === 'noduel');
  if (p2M.roles.array().indexOf(noduelRole) != -1) return message.channel.send("😩 Désolé, cet utilisateur ne souhaite pas recevoir de demande de duel."+"\n"+div).then(m=>{m.delete(5000)});
  var channel = message.channel;
  var p1 = message.author;
  
  var truc;
  
  var upDiv = "➖`"+p1.username+"`➖**VS**➖`"+p2.username+"`➖\n\n";
  
  if (p2 != client.user) {
    truc = await message.channel.send(upDiv+"👉 <@"+p2.id+"> tu as 1 minute pour envoyer `ok` dans ce channel pour accepter la demande de duel de <@"+p1.id+">."+"\n"+div);
    nm = await am([p2],channel,"ok","exclusive",1,60000,true,true);
    if(nm == false || nm == undefined) {
      return truc.edit("Désolé <@"+p1.id+">, je crois que c'est un vent.").then(m=>{m.delete(5000)});
    }
  } else {
    truc = await message.channel.send(upDiv+"👉 **Infinity** a accepté la demande de duel de <@"+p1.id+">."+"\n*Le duel va bientôt commencer...*\n"+div);
    await timer(10);  
  }
  
  var t = tirades.engager;
  var s = "⚔ "+t[Math.floor(Math.random() * t.length)].replace("p1","<@"+p1.id+">").replace("p2","<@"+p2.id+">")+"\n*(Vous avez 30 secondes pour vous taunt très salement.)*"+"\n"+div;
  truc = await truc.edit(upDiv+s);
  
  var test = await am([p1,p2],channel,"","any",100,30000,true,true);

  await truc.edit(upDiv+"**📢 Que le combat commence !**"+"\n"+div);
  await timer(5);

  var dégats;
  var nm;
  var tour = 0;
  var players = [
    {
      user:p1,
      pv:10
    },
    {
      user:p2,
      pv:13
    }
  ];
  var u;
  var v;
  
  while (players[0].pv > 0 && players[1].pv > 0) {
    
    if (tour % 2 == 0) {
      u = 0;
      v = 1;
    } else {
      u = 1;
      v = 0;
    }
    
    let mainm = await truc.edit(upDiv+"🎴 Tour de <@"+players[u].user.id+">"+"\n"+div);
    
    await timer(5);
    
    t = tirades.debut;
    s = "🏹 **"+t[Math.floor(Math.random() * t.length)].replace("p1","<@"+players[u].user.id+">").replace("p12","<@"+players[u].user.id+">")+"**\n"+tirades.pAttGif[Math.floor(Math.random() * tirades.pAttGif.length)]+"\n*("+players[u].user.username+" doit répondre*.)";
    mainm = await mainm.edit(upDiv+s+"\n"+div);
    if(players[u].user != client.user) nm = await am([players[u].user],channel,"","any",1,60000,true,true);
    
    if(players[u].user == client.user) {
      await timer(5);
      t = tirades.attaques;
      s = t[Math.floor(Math.random() * t.length)].replace("p1","<@"+players[u].user.id+">").replace("p2","<@"+players[v].user.id+">");
      channel.send(s).then(m=>m.delete(5000));
    }
    
    if(nm == false && players[u].user != client.user) {
      mainm = await mainm.edit(upDiv+":facepalm: Aïe aïe aïe,<@"+players[u].user.id+"> est un peu mou de genou, il n'a pas attaqué du tout !"+"\n"+div);
      tour += 1;
    } else {
      dégats = Math.floor(Math.random() * (6 - 0 + 1));
      let j;
      if(dégats <= 1) {
        t = tirades.dBigFail;
        j = tirades.fGif;
      } else if(dégats <= 2) {
        t = tirades.dFail;
        j = tirades.fGif;
      } else if(dégats > 5) {
        t = tirades.dBigSuccess;
        j = tirades.sGif;
      } else if(dégats > 2) {
        t = tirades.dSuccess;
        j = tirades.sGif;
      }
      await timer(2);
      
      if (dégats > players[v].pv) {
        dégats = players[v].pv;
      }
      
      s = "💥 **"+t[Math.floor(Math.random() * t.length)].replace("p1","<@"+players[u].user.id+">").replace("p2","<@"+players[v].user.id+">")+"**\n"+j[Math.floor(Math.random() * j.length)]+"\n\n⛑ <@"+players[v].user.id+"> prend **"+dégats+"** dégats.";  
      mainm = await mainm.edit(upDiv+s+"\n"+div);
      players[v].pv -= dégats;
      
      await timer(8);
      
      message.channel.send("\n\n➖➖➖➖**PV**❤➖➖➖\n`"+players[v].user.username+"` a **"+players[v].pv+"** PV\n`"+players[u].user.username+"` a **"+players[u].pv+"** PV\n"+div).then(m=>m.delete(6000));
      
      tour += 1;
      
      await timer (5);
    }
    
  }
  
  if (players[0].pv == 0) {
    u = 1; v = 0;
  } else if (players[1].pv == 0) {
    u = 0; v = 1;
  }
  
  await truc.edit(upDiv+"🏆 **<@"+players[v].user.id+"> est K.O ! <@"+players[u].user.id+"> remporte le duel !**");
  truc.delete(15000);
  
  
};

exports.data = {
  title: "duel",
  args: " <mention utilisateur>",
  desc: "Provoquer quelqu'un en duel !"
};