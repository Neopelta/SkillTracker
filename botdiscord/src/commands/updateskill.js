module.exports = {
    name: 'updateskill',
    description: 'Edit skill',

    async execute(client, message, args) {
        if (!args[0]) return message.channel.send('Veuillez spécifier une compétence');
        if (!args[1] || isNaN(args[1])) return message.channel.send('Veuillez spécifier un niveau (entre 0 et 10)');
        if (args[1] < 0 || args[1] > 10) return message.channel.send('Veuillez spécifier un niveau (entre 0 et 10)');

        try {
            const data = await client.spreedsheat.readData();

            for (let i = 0; i < data.length; i++) {
                const [name, id, update, ...rest] = data[i];
                if (id === message.author.id) {
                    const headers = data[0].slice(3);
                    if (headers.length > 0) {
                        for (let j= 0; j < headers.length; j++) {

                            if (headers[j].toLowerCase() === args[0].toLowerCase()) {
                                await client.spreedsheat.replaceElementInRow(i, j + 3, Number(args[1]));
                                return message.channel.send("Donnée mise à jour avec succès !");
                            } else if (j === headers.length - 1) {
                                return message.channel.send("Cette compétence n'existe pas");
                            }

                        }
                    } else {
                        return message.channel.send("Aucune compétence existante");
                    }

                } else {
                    if (i === data.length - 1) return message.channel.send("Vous n'apparaissez pas dans la liste des utilisateurs");
                }
            }

        } catch (err) {
            console.error(err);
            message.channel.send("Une erreur est survenue");
        }
    }
};
