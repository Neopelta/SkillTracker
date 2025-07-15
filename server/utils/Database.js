"use strict";

const mysql = require('mysql2/promise');

class Database {
    constructor(config) {
        this.pool = mysql.createPool({
            host: config.host,
            port: config.port || 3306,
            user: config.user,
            database: config.name,
            password: process.env.PASSWORD,
            ...config.options
        });
    }

    async testConnection() {
        try {
            const connection = await this.pool.getConnection();
            console.log("Connecté à la base de données via le pool.");
            connection.release();
        } catch (error) {
            console.error("Erreur de connexion à la base de données :", error);
            throw error;
        }
    }

    async query(sql, params = []) {
        try {
            const [rows] = await this.pool.query(sql, params);
            return rows;
        } catch (error) {
            console.error('Erreur lors de l\'exécution de la requête SQL :', error);
            throw error;
        }
    }

    async closePool() {
        await this.pool.end();
    }
}

module.exports = Database;