const { EmbedBuilder } = require('discord.js');

function createEmbed(page, data) {
    const embed = new EmbedBuilder()
        .setTitle(`Liste des utilisateurs - Page ${page + 1}/${Math.round(data.length / 3)}`)
        .setColor(0x00AE86);

    const headers = data[0];
    const startIndex = page * 3 + 1;

    data.slice(startIndex, startIndex + 3).forEach((row) => {
        const name = row[0];
        const values = row.slice(1).map((val, index) => `${headers[index + 1]}: ${val}`).join("\n");
        embed.addFields({ name, value: values, inline: true });
    });

    return embed;
}

module.exports = {
    name: 'skills',
    description: 'List skills!',

    async execute(client, message, args) {
        client.spreedsheat.readData()
            .then(async data => {
                let currentPage = 0;
                const totalPages = Math.ceil((data.length - 1) / 3);

                const embed = createEmbed(currentPage, data);
                const sentMessage = await message.channel.send({ embeds: [embed] });

                if (totalPages <= 1) return;

                await sentMessage.react('⬅️');
                await sentMessage.react('➡️');

                const filter = (reaction, user) =>
                    ['⬅️', '➡️'].includes(reaction.emoji.name) && user.id === message.author.id;

                const collector = sentMessage.createReactionCollector({ filter, time: 60000 });

                collector.on('collect', (reaction) => {
                    if (reaction.emoji.name === '➡️' && currentPage < totalPages - 1) {
                        currentPage++;
                    } else if (reaction.emoji.name === '⬅️' && currentPage > 0) {
                        currentPage--;
                    }

                    const newEmbed = createEmbed(currentPage, data);
                    sentMessage.edit({ embeds: [newEmbed] });

                    reaction.users.remove(message.author.id);
                });

                collector.on('end', () => {
                    sentMessage.reactions.removeAll();
                });
            })
            .catch(error => {
                console.error('Erreur lors de la lecture des données de Google Sheets:', error);
            });
    }
};
