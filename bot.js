const Discord = require("discord.js");
const axios = require('axios').default;

const client = new Discord.Client();
const {
    account_token
} = require("./config.json");

client.on("message", msg => {
  if (msg.content === "ping") {
    msg.reply("Pong!");
  }
});

client.on('ready', () => {
    console.log(`Looking for discord gifts...`);
});

client.on('message', message => {
    if(message.content.includes('discord.gift') || message.content.includes('discordapp.com/gifts/')) {

        var Nitro = /(discord\.(gift)|discordapp\.com\/gift)\/.+[a-z]/

        var NitroUrl = Nitro.exec(message.content);
        var NitroCode = NitroUrl[0].split('/')[1];

        console.log(`Nitro found in ${message.guild.name}`);
        
        axios({
            method: 'POST',
            url: `https://discordapp.com/api/v6/entitlements/gift-codes/${NitroCode}/redeem`, 
            headers: 
            {
            'Authorization': client.account_token 
            }
        }).then(
            () => console.log(`Successfull redeemed on ${message.guild.name}`)
        ).catch(ex => console.log(`Error | Failed to claim Nitro`))
    }
})

client.login(account_token)
