const Discord = require('discord.js');
const client = new Discord.Client();

const Config = require('./BugrudoBot/Config');

client.once('ready', () => {
    console.log('Ready!');


});

// client.on('message', msg => {
    
// });

client.login(Config.BotToken());