const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'help',
    description: 'Display a list of commands',

    async execute(client, message, args) {
        const commandFolder = path.join(__dirname, '');
        const commandsList = [];

        const commandFiles = fs.readdirSync(commandFolder).filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const command = require(path.join(commandFolder, file));
            commandsList.push({
                name: command.name,
                description: command.description,
            });
        }

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('List of Commands')
            .setDescription('Voici la liste des commandes disponibles :');

        commandsList.forEach(command => {
            embed.addFields({ name: command.name, value: command.description });
        });

        message.channel.send({ embeds: [embed] });
    }
};
