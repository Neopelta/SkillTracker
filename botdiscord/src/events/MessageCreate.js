const { Events } = require('discord.js');

module.exports = {
    name: Events.MessageCreate,
    async execute(client, message) {
        if (!message.content.startsWith(client.config.bot.prefix) || message.author.bot) return;

        const args = message.content.slice(client.config.bot.prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command = client.commands.get(commandName);
        if (!command) return;

        try {
            command.execute(client, message, args);
        } catch (error) {
            console.error(error);
            message.reply('Il y a eu une erreur en exécutant cette commande.');
        }
    },
};