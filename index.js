const Discord = require('discord.js');
const client = new Discord.Client();

const Config = require('./BugrudoBot/Config');
const DateHelper = require('./BugrudoBot/DateHelper');

client.once('ready', () => {
    console.log('Ready!');
});

client.on('message', msg => {
   if(msg.mentions.has(client.user) && !msg.content.toLowerCase().startsWith('@here')) {
        const messageContentAsArray = msg.content.split(' ');

        if(messageContentAsArray.length == 1) {
            const embed = {
                color: 0x0099ff,
                title: 'Commands',                
                fields: [
                    {
                        name: '@BugrudoBot days',
                        value: 'Show how many days it\'s been since PerudoBot has had a bug',
                    },
                    {
                        name: '@BugrudoBot count',
                        value: 'Show how many bugs PerudoBot has had'
                    },
                    {
                        name: '@Bugrudo bug',
                        value: 'Sets today as the most recent day since PerudoBot has had a bug',
                    },
                ]
            };

            msg.channel.send({embed: embed});
        } else if(messageContentAsArray[1] === 'days') {
            var fs = require("fs");

            fs.readFile("date.txt", "utf-8", (err, data) => {
                if (err) 
                { 
                    console.log(err) 
                }

                var daysBetween = DateHelper.DaysBetween(new Date(data))
                msg.channel.send(`Days since PerudoBot has had a bug: **${daysBetween}**`)
            });
        } else if(messageContentAsArray[1] === 'count') {
            var fs = require("fs");

            fs.readFile("bugCount.txt", "utf-8", (err, data) => {
                if (err) 
                { 
                    console.log(err) 
                }

                msg.channel.send(`Bugs PerudoBot has had: **${data}**`)
            });
        } else if(messageContentAsArray[1] === 'bug') {
            var fs = require("fs");

            fs.writeFile("date.txt", (new Date()).toISOString(), (err) => {
                if (err) { 
                    console.log(err); 
                }
            });

            fs.readFile("bugCount.txt", "utf-8", (err, data) => {
                if (err) 
                { 
                    console.log(err) 
                }
        
                var days = parseInt(data, 10) + 1;
        
                fs.writeFile("bugCount.txt", days, (err) => {
                    if (err) { 
                        console.log(err); 
                    }
                });
        
                console.log(days);
            });

            msg.channel.send('Updated bug counter');
        }

   }
});

client.login(Config.BotToken());