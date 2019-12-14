const DiscordBot = require('./discordBot.js');
DiscordBot.run();

translate = require('./sendstream.js');

async function logTrans (content,lang) {
    var text = await translate.run(content,lang);
    console.log(text);
}

logTrans("<@109709173071> est un codeur incroyable. ","ja");
