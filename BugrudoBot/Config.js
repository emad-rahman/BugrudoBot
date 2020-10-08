module.exports = { 
    BotToken: function() {
        if(IsProd()) {
            return process.env.BOT_TOKEN;
        } else {
            const config = LoadLocalConfig();
            return config.token;
        }
    },
    TenorApiKey: function() {
        if(IsProd()) {
            return process.env.TENOR_API_KEY;
        } else {
            const config = LoadLocalConfig();
            return config.tenorApiKey;
        }
    },
    DiscordServerId: function() {
        if(IsProd()) {
            return process.env.DISCORD_SERVER_ID;
        } else {
            const config = LoadLocalConfig();
            return config.discordServerId;
        }
    },
    DiscordClientId: function() {
        if(IsProd()) {
            return process.env.DISCORD_CLIENT_ID;
        } else {
            const config = LoadLocalConfig();
            return config.discordClientId;
        }
    }
}

function IsProd() {
    return process.env.PROD_IDENTIFIER !== undefined;
}

function LoadLocalConfig() {
    var config = require("../local-config.json");
    return config;
}