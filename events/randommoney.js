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

exports.run = function (client, message, dbu) {
  
  if (message.author.bot) return;
  if (message.content.length <= 8) return;
  var rdmWin = Math.floor(Math.random() * (10 - 0 + 1)) > 9 ? true : false;
  if (rdmWin == false) return;
  
  dbu.findOne({discordId: message.author.id}, async function(err, found) {
    if(err) {
      return; //un problème avec la base de données
    }
    if (found) { //utilisateur déjà membre de liberty of world ou d'un de ses serveurs
      var gain = Math.round(normal(120,20,1));
      message.channel.send("🎁 <@"+message.author.id+"> gagne **"+gain+"** iC au loto des beaux parleurs, félicitations !").then(m=>m.delete(5000));
      
      found.balance += gain;
      await found.save();
      
    }
  });
};

exports.data = {
  title: "nom",
  desc: "description rapide"
};