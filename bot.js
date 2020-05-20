const Discord = require("discord.js");
const client = new Discord.Client();

client.on("message", message => {
  if(message.content.toLowerCase().includes("giveaway")) {
    if(message.author.bot) {
      message.react("🎉")
    }
  }
});

client.login(process.env.BOT_TOKEN);
