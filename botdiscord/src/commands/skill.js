module.exports = {
    name: 'skill',
    description: 'Display a list of skill for a user!',

    async execute(client, message, args) {
        const userId = args[0]?.replace(/[<@!>]/g, '');
        if (!userId) return message.channel.send('Veuillez spécifier un utilisateur avec un ID ou une mention.');

        try {
            const data = await client.spreedsheat.readData();

            for (let i = 0; i < data.length; i++) {
                const [name, id, update, ...rest] = data[i];
                if (id === userId) {
                    const headers = data[0].slice(3);

                    if (headers.length > 0) {
                        let msg = "Liste des compétences :\n";
                        for (let j= 0; j < headers.length; j++) {
                            if (rest[j]) {
                                msg += `- \`${headers[j]}\` : ${rest[j]}/10\n`;
                            }
                        }

                        return message.channel.send(msg);
                    } else {
                        return message.channel.send("Aucune compétence associée");
                    }

                } else {
                    if (i === data.length - 1) return message.channel.send("Aucun compte associé !");
                }
            }

        } catch (err) {
            console.error(err);
            message.channel.send("Une erreur est survenue");
        }
    }
};
