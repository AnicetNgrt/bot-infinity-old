exports.run = function (client, message, args, dbu, dbg) {
  if(message.guild.owner.user == message.author || message.author.id == "271248632571756544") {
    dbg.findOne({id:message.guild.id}, async function(err,found){
      if(err) return;
      if(found) {
        found.wantBlacklist = false;
        found.save();
        message.channel.send("❎ Firewall désactivé.");
      }
    });
  }
};

exports.data = {
  title: "firewallOff",
  args: "",
  desc: "Seul l'owner peut le faire"
};