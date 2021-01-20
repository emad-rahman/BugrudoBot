const Discord = require('discord.js');
const client = new Discord.Client();

const Config = require('./BugrudoBot/Config');
const DateHelper = require('./BugrudoBot/DateHelper');

const sqlite3 = require('sqlite3').verbose();
const PREVIOUS_BUGS = 16;

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
                    {
                        name: '@Bugrudo bug this is an example bug log',
                        value: 'Sets today as the most recent day since PerudoBot has had a bug and logs the bug as \'this is an example bug log\'',
                    },
                    {
                        name: '@Bugrudo logs',
                        value: 'Show all bugs logged',
                    },
                ]
            };

            msg.channel.send({embed: embed});
        } else if(messageContentAsArray[1] === 'days') {
            let db = new sqlite3.Database('./bugrudo.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
                if (err) {
                    console.error(err.message);
                }
                console.log('Connected to the bugrudo database.');
            });
            
            db.serialize(() => {
                var query = `SELECT * FROM bugs ORDER BY date DESC LIMIT 1`;
                db.all(query, [], (err, rows) => {
                    if(err) {
                        throw err;
                    }

                    if (rows.length > 0) {
                        var daysBetween = DateHelper.DaysBetween(new Date(rows[0].date));
                        msg.channel.send(`Days since PerudoBot has had a bug: **${daysBetween}**`);
                    } else {
                        msg.channel.send(`No data in the database!`);
                    }
            
                }); 
            });
            
            db.close((err) => {
                if (err) {
                  console.error(err.message);
                }
                console.log('Close the database connection.');
            });
        } else if(messageContentAsArray[1] === 'count') {
            let db = new sqlite3.Database('./bugrudo.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
                if (err) {
                    console.error(err.message);
                }
                console.log('Connected to the bugrudo database.');
            });
            
            db.serialize(() => {
                var query = `SELECT * FROM bugs ORDER BY date DESC`;
                db.all(query, [], (err, rows) => {
                    if(err) {
                        throw err;
                    }
                    var count = rows.length + PREVIOUS_BUGS;
                    console.log("count is: " + count)
                    msg.channel.send(`Bugs PerudoBot has had: **${count}**`)
            
                    rows.forEach((row) => {
                        console.log(row.description);
                    });
            
                }); 
            });
            
            
            db.close((err) => {
                if (err) {
                  console.error(err.message);
                }
                console.log('Close the database connection.');
            });
        } else if(messageContentAsArray[1] === 'bug') {
            let db = new sqlite3.Database('./bugrudo.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
                if (err) {
                    console.error(err.message);
                }
                console.log('Connected to the bugrudo database.');
            });

            var description = 'no description provided';
            if(messageContentAsArray.length > 2){
                messageContentAsArray.splice(0, 2);
                description = messageContentAsArray.join(" ");
            }

            db.serialize(() => {            
                db.run(`INSERT INTO bugs (date, description) VALUES (datetime('now'), '${description}')`);
                console.log('Added bug to db');
                msg.channel.send('Updated bug counter');
            });
            
            db.close((err) => {
                if (err) {
                  console.error(err.message);
                }
                console.log('Close the database connection.');
            });
        } else if(messageContentAsArray[1] === 'logs') {
            let db = new sqlite3.Database('./bugrudo.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
                if (err) {
                    console.error(err.message);
                }
                console.log('Connected to the bugrudo database.');
            });
            
            db.serialize(() => {
                var query = `SELECT * FROM bugs ORDER BY date DESC`;
                db.all(query, [], (err, rows) => {
                    if(err) {
                        throw err;
                    }

                    if (rows.length == 0) {
                        msg.channel.send(`No data in the database!`);
                    } else {
                        var message = "";

                        rows.forEach((row) => {
                            if(message.length > 1500) {
                                msg.channel.send(message);
                                message = "";
                            }

                            message += `**${row.date}**: ${row.description}\n`;
                        });

                        if(message.length > 0) {
                            msg.channel.send(message);
                        }
                    }
                }); 
            });
            
            db.close((err) => {
                if (err) {
                  console.error(err.message);
                }
                console.log('Close the database connection.');
            });
        }
   }
});

client.login(Config.BotToken());