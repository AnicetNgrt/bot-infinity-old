function timer (s) {
  return new Promise((resolve,reject)=>{
    setTimeout(()=>{
      resolve();
    },s*1000);
  });
}


exports.run = async function (client, message, args, dbu, dbg) {
  message.delete(1000);
  if (isNaN(args[0])) return message.channel.send("Veuillez indiquer un nombre de secondes valide.");
  var msg = await message.channel.send("COMPTE À REBOURS:\n**"+args[0]+"** s ");
  await timer(1);
  for (var i=1; i<parseInt(args[0]);i++){
    msg.edit("COMPTE À REBOURS:\n**"+(args[0]-i)+"** s");
    await timer(1);
  }
  msg.edit("***🔔 FIN***");
  msg.delete(2000);
};

exports.data = {
  title: "rebours",
  args: " <temps en secondes>",
  desc: "Compte à rebours."
};