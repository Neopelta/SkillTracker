const { Events } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        client.user.setPresence({
            activities: [
                {
                    name: `AAW ! My prefix is ${client.config.bot.prefix}`,
                    type: 0,
                },
            ],
            status: 'online'
        });

        console.log(`Connected as ${client.user.tag}`);
    },
};