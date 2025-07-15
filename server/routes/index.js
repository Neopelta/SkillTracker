"use strict";

const { Router } = require("express");
const { authenticate } = require("../middlewares/authenticate");

module.exports = class Index extends Router {
    constructor() {
        super();

        this.get("/sessions/connected-users", authenticate, async (req, res) => {
            try {
                const rows = await req.database.query("SELECT session_id FROM session WHERE expiration_date > NOW();");

                return res.status(200).json({ data: rows });
            } catch (error) {
                console.error("Erreur lors de la requête : ", error);
                return res.status(500).json({ message: "Erreur interne du serveur." });
            }
        });

        this.post("/auth/session", authenticate, async (req, res) => {
            try {
                const { session_id, token, expiration_date } = req.body;

                if (!session_id || !token || !expiration_date) {
                    return res.status(400).json({ error: "Missing required fields: session_id, token, or expiration_date." });
                }

                const query = `
                    INSERT INTO session (session_id, token, expiration_date)
                    VALUES (?, ?, ?)
                        ON DUPLICATE KEY UPDATE
                                             token = VALUES(token),
                                             expiration_date = VALUES(expiration_date)
                `;

                await req.database.query(query, [session_id, token, expiration_date]);

                return res.status(200).json({ message: "Session created or updated successfully." });
            } catch (error) {
                console.error("Error processing session: ", error);
                return res.status(500).json({ error: "Internal server error." });
            }
        });

        this.post("/session/logout", authenticate, async (req, res) => {
            try {
                const { session_id } = req.body;

                if (!session_id) {
                    return res.status(400).json({ error: "Missing required field: session_id." });
                }

                const query = `
                    UPDATE session
                    SET expiration_date = NOW()
                    WHERE session_id = ?
                      AND expiration_date > NOW()
                `;

                const result = await req.database.query(query, [session_id]);

                if (result.affectedRows === 0) {
                    return res.status(404).json({ message: "Session not found or already expired." });
                }

                return res.status(200).json({ message: "Session deleted successfully." });
            } catch (error) {
                console.error("Error processing session logout: ", error);
                return res.status(500).json({ error: "Internal server error." });
            }
        });

        this.get("/session/isconnected", authenticate, async (req, res) => {
            try {
                const { session_id } = req.query;

                if (!session_id) {
                    return res.status(400).json({ error: "Missing required fields." });
                }

                const query = `
                    SELECT token, expiration_date FROM session
                    WHERE session_id = ? AND token IS NOT NULL
                `;
                const [rows] = await req.database.query(query, [session_id]);
                console.log(rows);
                const isConnected = rows === undefined || (rows && rows.expiration_date > new Date()) ;
                return res.status(200).json({ isConnected });

            } catch (error) {
                console.error("Erreur lors de la requête :", error);
                return res.status(500).json({ error: "Internal server error." });
            }
        });
    }

};
