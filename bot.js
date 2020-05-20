
const request = require('request');
const chalk = require('chalk');
const Discord = require('discord.js');
const bot = new Discord.Client();
const title = require('console-title');
const fs = require('fs');
const notifier = require('node-notifier');
let configfile = fs.readFileSync('config.json');
let config = JSON.parse(configfile);
let token = process.env.BOT_TOKEN

let count = 0;

console.log("Starting Nitrate...")

bot.on("ready", () => {
    console.log(`Logged in as: ${chalk.yellow(bot.user.tag)}\nEmail: ${chalk.bold(bot.user.email)}\nID: ${chalk.bold(bot.user.id)}`);
    title(`${bot.user.tag} | ${bot.guilds.size} guilds | ${bot.user.friends.size} friends`);
    if(config.presence !== true) return;

    try {
        const client = require('discord-rich-presence')('666600021185265666');
        client.updatePresence({
        state: 'Sniping nitro...',
        startTimestamp: Date.now(),
        largeImageKey: 'nitrate',
        smallImageKey: 'null',
        instance: true,
      });

      }
    catch(err) {
        console.log(`Couldn't set your rich presence... `)
    }
});
async function reload() {
    config = require("./config.json")
}
async function add(msg, args) {
    let id = args[1]
    let config1 = require(`./config.json`, `utf-8`)
    if(!config1.blacklisted.includes(id)) {
        config1.blacklisted.push(id)
        fs.writeFileSync('./config.json', JSON.stringify(config1), `utf-8`)
        reload()
        msg.channel.send(`Added \`${id}\` to the blacklist!`)
    }
    else {
        msg.channel.send(`That id is already in the blacklist!`)
    }
}
async function remove(msg, args) {
    let id = args[1]
    let config1 = require(`./config.json`, `utf-8`)
    if(config1.blacklisted.includes(id)) {
        let oof = config1.blacklisted.filter(function(item){
            return item !== args[1]
        })
        config1.blacklisted = oof
        fs.writeFileSync('./config.json', JSON.stringify(config1), `utf-8`)
        reload()
        msg.channel.send(`Removed \`${id}\` to the blacklist!`)
    }
    else {
        msg.channel.send(`This ID is not blacklisted`)
    }
}
let repeated = [];

bot.on("message", msg => {
    if(config.selfbot !== true) return;
        if(msg.author.id !== bot.user.id) return;
        let args = msg.content.split(" ").slice(1)
        if(msg.content.toLowerCase().startsWith("$blacklist")){
            if(!args[0] || !args[1]) return msg.channel.send(`Please use the command like this: \`$blacklist add/remove guildid/userid/channelid\`. This will add or remove that id from the blacklist meaning nitrate will no longer register messages by that user.`)
            let options = ["add", 'remove']
            let option = args[0].toLowerCase()
            if(!options.includes(option) || !parseInt(args[1])) return msg.channel.send(`Please use the command like this: \`$blacklist add/remove guildid/userid/channelid\`. This will add or remove that id from the blacklist meaning nitrate will no longer register messages by that user.`)
            if(option === "add") return add(msg, args)
            if(option === "remove") return remove(msg, args)
        }
    })

bot.on("message", message => {
    try {
        if(message.channel.type === "dm" || message.channel.type === "group") return;
        if(config.blacklisted.includes(message.author.id) || config.blacklisted.includes(message.guild.id) || config.blacklisted.includes(message.channel.id)) return;
        let code;
        if (message.channel.type != 'dm' && message.channel.type != 'group') {
            // Nitro Sniper
            if (message.content.includes("discord.gift") || message.content.includes("discordapp.com/gifts/")) {
                var start = new Date();
                console.log(`[${chalk.bgYellow("GIFT")}] - [${chalk.cyan(message.guild.name)}] [${"#" + chalk.yellow(message.channel.name)}] - ${chalk.magenta(message.author.tag)}: ${chalk.underline(message.content)}`);
                // Testing if the message is a nitro gift link.
                if (message.content.includes("discord.gift")) {
                    code = message.content.split("discord.gift/").pop();
                    code = code.replace(/\s+/g," "); // Replaces all break lines with spaces in one line.
                    code = code.split(' ')[0]; // Removes everything after the code.

                    // Repeated code skip.
                    if (repeated.includes(code)) {
                        console.log(`${code} - Already attempted`);
                    }
                    else {
                        request.post({
                            url: 'https://discordapp.com/api/v6/entitlements/gift-codes/' + code + '/redeem',
                            headers: {
                                'Authorization': token
                            },
                            time: true
                        }, function (error, response, body) {
                            var result = JSON.parse(body);
                            var responseTime = new Date() - start;
                            console.log(`[${chalk.bgBlack('*')}] - ${result.message} (${responseTime / 1000}s)`);
                            // Notification alerts.
                            notifier.notify({
                                title: 'Nitrate',
                                icon: 'nitro-png-2.png',
                                appID: `${message.guild.name} | #${message.channel.name} | ${message.author.tag}`,
                                message: result.message,
                                timeout: 0.1
                            });
                        });
                        repeated.push(code);
                    }
                }
                // Otherwise, check if the message is another gift link variant.
                else if (message.content.includes("discordapp.com/gifts")){
                    code = message.content.split("discordapp.com/gifts/").pop();
                    code = code.replace(/\s+/g," "); // Replaces all break lines with spaces in one line.
                    code = code.split(' ')[0]; // Removes everything after the code.
                    
                    if (repeated.includes(code)) {
                        console.log(`${code} - Already attempted.`);
                    }
                    else {
                        request.post({
                            url: 'https://discordapp.com/api/v6/entitlements/gift-codes/' + code + '/redeem',
                            headers: {
                                'Authorization': token
                            },
                            time: true
                        }, function (error, response, body) {
                            var result = JSON.parse(body);
                            var responseTime = new Date() - start;
                            console.log(`[${chalk.bgBlack('*')}] - ${result.message} (${responseTime / 1000}s)`);
                            // Notification alerts
                            notifier.notify({
                                title: 'Nitrate',
                                icon: 'nitro-png-2.png',
                                appID: `${message.guild.name} | #${message.channel.name} | ${message.author.tag}`,
                                message: result.message,
                                timeout: 0.1
                            });
                        });
                        repeated.push(code);
                    }
                }
                count += 1;
                if (count == 1) {
                    title(`${bot.user.tag} | ${bot.guilds.size} guilds | ${bot.user.friends.size} friends | ${count.toString()} gift`)
                }
                else if (count > 1) {
                    title(`${bot.user.tag} | ${bot.guilds.size} guilds | ${bot.user.friends.size} friends | ${count.toString()} gifts`)
                }
            }
        }
    }
    catch(e) {
        console.log(e)
    }
});
bot.login(token).catch(function (error) {
    console.log(error.message);
});
