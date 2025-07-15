const { Client, Collection, GatewayIntentBits  } = require("discord.js"),
    { readdirSync } = require("fs-extra"),
    { join } = require("path"),
    dotenv = require("dotenv"),
    GoogleSheetsHandler = require("./src/utils/GoogleSheetsHandler");

class Index extends Client {
    constructor() {
        super({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessageReactions] });

        this.config = require("./config");
        this.commands = new Collection();

        dotenv.config();
        this.spreedsheat = new GoogleSheetsHandler(this.config.spreadsheet.id, this.config.spreadsheet.range, process.env.spreadsheet);

        this.launch();
    }

    launch() {
        this.eventsLoad();
        this.commandsLoad();
        this.login(process.env.token).then(() => console.log(["Base-WS"], "Connected to discord")).catch((e) => {
            console.error(["Base-WS"], `Connection error: ${e}`);
            return process.exit(1);
        });
    }

    eventsLoad() {
        const eventsPath = join(__dirname, 'src/events');
        const events = readdirSync(eventsPath).filter(f => f.endsWith('.js'));
        if (events.length === 0) return console.log(['Problem'], 'No event found!');

        let count = 0;

        for (const file of events) {
            const filePath = join(eventsPath, file);
            const event = require(filePath);
            this.on(event.name, (...args) => event.execute(this, ...args));

            console.log(['Events'], `${event.name} loaded`);
        }
    }

    commandsLoad() {
        const commandFiles = readdirSync(join(__dirname, 'src/commands')).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const command = require(`./src/commands/${file}`);
            this.commands.set(command.name, command);
        }

        console.log(['Commands'], `Commands loaded`);
    }
}

module.exports.client = new Index();