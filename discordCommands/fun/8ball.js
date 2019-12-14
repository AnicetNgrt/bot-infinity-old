const Discord = require("discord.js");

exports.run = function (client, message, args, dbu, dbg) {
  if (!args[0]) return message.channel.send("Veuillez **poser une question** :x:")
  let answers = [" Non :x: ", " J'ai envie de dormir :zzz: ", " Balec :face_palm: ", " Peut être... :thinking: ", " Absolument :interrobang: ", " Tu veux quoi toi !! :rage: " , "Malheureusement :disappointed: ","J'ai oublier les pizzas "," Je crois être plus utile que toi :sunglasses: ","C'est vraie que j'aime bien ça"]
  let question = args[0];
  let embed = new Discord.RichEmbed()
    .setAuthor(message.author.tag, message.author.displayAvatarURL)
    .setColor("#5cf442")
    .addField("Question :", question, true)
    .addField("Réponse :", answers[Math.floor(Math.random() * answers.length)], true)
  message.channel.send(embed)
};

exports.data = {
  title: "8ball",
  args: " <question (entre guillemets)>",
  desc: "Ceci n'a rien d'aléatoire, notre IA est très sofistiquée ||non||"
};