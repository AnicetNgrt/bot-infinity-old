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
        case "oneOf":
            if(content.indexOf(m.content.trim()) != -1) {
                first = true;
            }
        break;
        case "any":
        first = true;
        break;
    }
    if(del == true) {
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
    if (p2.bot) return message.channel.send("❌ Tu ne peux pas engager un bot en duel, ce sont des tricheurs de toute façon."+"\n"+div).then(m=>{m.delete(5000)});
    let noduelRole = message.guild.roles.find(role => role.name === 'noduel');
    if (p2M.roles.array().indexOf(noduelRole) != -1) return message.channel.send("😩 Désolé, cet utilisateur ne souhaite pas recevoir de demande de duel."+"\n"+div).then(m=>{m.delete(5000)});
    var channel = message.channel;
    var p1 = message.author;

    var truc; var p1m = "<@"+p1.id+">"; var p2m = "<@"+p2.id+">";

    var upDiv = "➖`"+p1.username+"`➖**VS**➖`"+p2.username+"`➖\n\n";
    var div = "➖➖➖➖➖➖➖➖➖";

    truc = await message.channel.send(upDiv+"👉 "+p2m+" tu as 1 minute pour envoyer `ok` dans ce channel pour accepter la demande de duel de "+p1m+"."+"\n"+div);
    nm = await am([p2],channel,"ok","exclusive",1,60000,true,true);
    if(nm == false || nm == undefined) {
        return truc.edit("Désolé <@"+p1.id+">, je crois que c'est un vent.").then(m=>{m.delete(5000)});
    }

    truc.edit(upDiv+"")


}
  exports.data = {
    title: "reply",
    args: " <message (entre guillemets)>",
    desc: "Ordonner au bot de dire quelque chose."
  }