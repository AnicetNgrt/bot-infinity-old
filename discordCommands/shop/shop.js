const Item = require("../../data/items.js");

exports.run = function (client, message, args, dbu, dbg) {
  var text = "➖➖✖-__**🛍BOUTIQUE**__-✖➖➖\n";
  dbg.find({id:message.guild.id},(err,found)=>{
    if (err) return;
    if(found){
      if(found.items.length==0){
        return text+="Oops, il semble que nous n'ayons plus rien en magasin... désolé ! 😓";
      }
      for(var i in found.items){
        if(found.items[i] != null) {
          Item.findOne({_id:found.items[i]},(err,item)=>{
            if(err) return;
            if(item) {
              text+="**"+item.name
            }  
          });
        }
      }
    }
  });
};

exports.data = {
  title: "nom",
  args: "",
  desc: "description rapide"
};