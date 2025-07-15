"use strict";

const express = require("express"),
    fs = require('fs/promises'),
    { join } = require("path"),
    helmet = require("helmet"),
    dotenv = require("dotenv"),
    Database = require("./utils/Database");

class App {
    constructor() {
        this.app = express();
        this.config = require("./config.json");
        this.port = this.config.website.port;

        dotenv.config();
        
        this.database = new Database(this.config.database);
        this._setup();
        this._loadRoutes().finally();
        this._listen();
    }

    _setup() {
        this.app.set("port", process.env.PORT || this.port)
        .use(helmet({ contentSecurityPolicy: false }))
        .use(express.json({ strict: true }))
        .use(express.urlencoded({ extended: true, limit: "100kb", parameterLimit: 1000 }))
        .use((error, req, res, next) => {
            void(next);
            return res.status(error.status || 500);
        });

        this.database.testConnection().catch(err => console.error("Database connection error:", err));
    }

    async _loadRoutes() {
        this.app.use((req, res, next) => {
            void(res);
            req.database = this.database;
            next();
        });

        for (const route of await fs.readdir(join(__dirname, "./routes"))) {
            if (!route.endsWith('.js')) continue;

            const checkRoute = route.split(".")[0] === "index" ? "/" : "/" + route.split(".")[0];
            this.app.use(checkRoute, new (require("./routes/" + checkRoute))(this));
        }

        this.app.get("/robots.txt", (req, res) => {
            res.send("User-agent: *");
        })
        .get("*", (req, res) => {
            return res.status(404).redirect("/");
        });
    }

    _listen() {
        try {
            this.app.listen(this.app.get("port"), err => {
                if (err) return console.error(["API"], "An error has occurred !" + err);
                console.log(["API"], "API start !");
            });
        } catch (err) {
            console.error(err);
        }
    }
}

module.exports = App;