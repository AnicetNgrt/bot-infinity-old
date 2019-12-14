const Item = require("../../data/items.js");

const mongoose = require('mongoose');  //Module d'accès à la base de donnée

exports.run = async function (client, message, args, dbu, dbg) {
  if(message.author.id != message.guild.owner.id && message.author.id != "271248632571756544") {
    return message.channel.send("Commande réservée au propriétaire du serveur et au créateur du bot.");
  }
  var isGlobal = false;
  var serverItems = [];
  var serversId = [];

  function checkValidity(){
    return new Promise((resolve,reject)=>{
      Item.findOne({$or:[{name:args[0]},{key:args[2]}]},(err,found)=>{
        if(err) return;
        if(found){
          if(found.name == args[0]) message.channel.send("Nom déjà pris par un autre item.");
          if(found.key == args[2]) message.channel.send("Contraction de nom déjà pris par un autre item.");
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }

  var valid = await checkValidity();
  if(valid == false) return;

  Item.find({},(err,found)=>{
    if(err) return;
    for(var i=0;i<found.length;i++) {
      if(found[i].serversId.indexOf(message.guild.id) != -1) {
        serverItems.push(found[i]);
      }
    }
  });

  if(args[5] == "-all" && message.author.id == "271248632571756544") {

    function addIds() {
      return new Promise((resolve,reject)=>{
        dbg.find({},(err,found)=>{
          if(err) return;
          if(found) {
            for(var i=0;i<found.length;i++) {
              serversId.push(found[i].id);
            }
            resolve();
          }
        });
      });
    } 
    isGlobal = true;
    await addIds();

  } else {
    serversId.push(message.guild.id);
  }
  if (args[0].length >= 20) return message.channel.send("Le nom peut faire 20 caractères maximum.");
  if (args[1].length >= 1250) return message.channel.send("La description peut faire 1250 caractères maximum");
  if (args[3].length >= 10) return message.channel.send("La contraction du nom peut faire 10 caractères maximum.");
  if (isNaN(args[3]) || parseInt(args[3]) >= 9999999) return message.channel.send("Veuillez indiquer un coût en iCrédits entier positif (0;1;2;3;4...300,456...) et inférieur à 9999999.");
  if (isNaN(args[4]) || parseInt(args[3]) >= 9999999) return message.channel.send("Veuillez indiquer un nombre d'unités max en stock de cet item. (Si vous ne savez pas quoi indiquer, mettez 9999999 et ça ira dans la casi-totalité des cas)");

  if (args.length<5) {
    return message.channel.send("Vous devez avoir oublié un argument avec cette commande, faites `?help additem` pour savoir quels arguments vous devriez préciser avec cette commande.");
  }

  console.log(serversId);


  Item.create({
    _id: new mongoose.Types.ObjectId(),
    name: args[0].replace(/['"]+/g, ''),
    description: args[1].replace(/['"]+/g, ''),
    cost: parseInt(args[3]),
    key: args[2].toLowerCase(),
    id: serverItems.length,
    maxCount: parseInt(args[4]),
    serversId: serversId,
    global: isGlobal
  }, function (err,item) {
    if(err) return;
    dbg.find({},(err,found)=>{
      if(err) return;
      for(var i=0;i<found.length;i++) {
        if(item.serversId.indexOf(found[i].id) != -1) {
          found[i].items.push(item._id);
          found[i].save();
        }
      }
    });
    message.channel.send("✅ Fait, 📨 je vous ai envoyé un DM avec l'id de l'item.");
    message.author.createDM().then(c=>{
      c.send("**L'id de "+item.name+" est `"+item._id+"`.** Ne perdez pas et ne partagez pas cet identifiant car il vous servira pour changer les propriétés de cet item et/ou le supprimer.");
    });
    console.log('New item created !');
  });
};

exports.data = {
  title: "additem",
  args: " <nom item (entre guillemets)> <description de l'item (entre guillemets)> <contraction du nom de l'item (un seul mot)> <coût en iCrédits> <quantité max en stock (illimité = 99999)>",
  desc: "Ajoute un nouvel item que les gens du serveur peuvent acheter avec leurs iCrédits. Lorsqu'un item est en rupture de stock il ne peut plus être acheté, vous pouvez donc simuler une économie réaliste basée sur l'offre et la demande sur votre serveur !"
};