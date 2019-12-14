exports.run = function (client, message, args, dbu, dbg) {
  if(message.guild.owner.user == message.author || message.author.id == "271248632571756544") {
    console.log("test");
    dbg.findOne({id:message.guild.id}, async function(err,found){
      if(err) return;
      if(found) {
        found.wantBlacklist = true;
        found.save();
        message.channel.send("✅ Firewall activé.");
      }
    });
  }
};

exports.data = {
  title: "firewallOn",
  args: "",
  desc: "Seul l'owner peut le faire"
};