import express from "express";
import passport from "passport";
import { Strategy as DiscordStrategy } from "passport-discord";
import session from "express-session";
import dotenv from "dotenv";
import {fileURLToPath} from "url";
import path from "path";
import { google } from 'googleapis';
import fs from 'fs';
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(session({ 
    secret: process.env.SESSION_SECRET,
    resave: false, 
    saveUninitialized: false 
}));
app.use(passport.initialize());
app.use(passport.session());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

passport.use(
    new DiscordStrategy(
        {
            clientID: process.env.DISCORD_CLIENT_ID,
            clientSecret: process.env.DISCORD_CLIENT_SECRET,
            callbackURL: process.env.DISCORD_CALLBACK_URL,
            scope: ["identify", "email"],
        },
        (accessToken, refreshToken, profile, done) => {
            // console.log("Discord ID récupéré:", profile.id);
            // console.log("Profile complet:", profile);
            return done(null, profile);
        }
    )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

const credentials = JSON.parse(fs.readFileSync('./spreadsheet.json'));
const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
});
const sheets = google.sheets({ version: 'v4', auth });

app.get("/auth/discord", passport.authenticate("discord"));

app.get(
    "/auth/discord/callback",
    passport.authenticate("discord", { failureRedirect: "/" }),
    (req, res) => {
        // console.log("Authentification réussie, user:", req.user?.id);
        const accessToken = req.user.accessToken;
        const profile = req.user;

        const currentDate = new Date();
        currentDate.setHours(currentDate.getHours() + 6); // token expiration
        const formattedDate = currentDate.toISOString().split('T')[0] + ' ' + currentDate.toTimeString().split(' ')[0];

        fetch(process.env.BASE_API_URL + "/auth/session", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: process.env.API_TOKEN
            },
            credentials: "include",

            body: JSON.stringify({session_id: profile.id, token: accessToken, expiration_date: formattedDate}),
        }).then(r => console.log(r)).catch(e => console.error(e));

        res.redirect("/");
    }
);

app.post("/auth/session", async (req, res) => {
    try {
        const apiResponse = await fetch(process.env.BASE_API_URL + "/auth/session", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: process.env.API_TOKEN
            },
            body: JSON.stringify(req.body),
        });

        if (!apiResponse.ok) {
            return res.status(apiResponse.status).json({ error: "Erreur de l'API sous-jacente" });
        }

        const data = await apiResponse.json();
        res.status(200).json(data);
    } catch (error) {
        console.error("Erreur lors de l'appel à l'API :", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

app.get("/auth/logout", (req, res) => {
    if (req.isAuthenticated()) {
        req.logout((err) => {
            if (err) {
                return res.status(500).json({ message: "Failed to log out", error: err });
            }
        });
    }
    return res.redirect("/");
});

app.get("/sessions/connected", (req, res) => {
    fetch(process.env.BASE_API_URL + "/sessions/connected-users", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: process.env.API_TOKEN
        },
        credentials: "include"
    })
        .then(r => r.json())
        .then(data => {
            console.log("Données reçues de l'API:", data);
            res.status(200).json(data);
        })
        .catch(e => {
            console.error("Erreur lors de la récupération des sessions:", e);
            res.status(500).json({ error: "An error occurred" });
        });
});

app.post("/session/logout", async (req, res) => {
    try {
        const { session_id } = req.body;

        if (!session_id)
            return res.status(400).json({ error: "Session ID is required." });


        const response = await fetch(process.env.BASE_API_URL + "/session/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: process.env.API_TOKEN
            },
            body: JSON.stringify({
                session_id: session_id,
            }),
        });

        if (!response.ok)
            return res.status(500).json({ error: "Failed to log out the user on the database." });


        return res.status(200).json({ message: "User logged out successfully." });
    } catch (error) {
        console.error("Error during logout:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
});

app.get("/api/user", (req, res) => {
    console.log("Session user ID:", req.user?.id);
    console.log("Is authenticated:", req.isAuthenticated());
    if (req.isAuthenticated()) {
        return res.json(req.user);
    } else {
        return res.status(401).json({ message: "Not authenticated" });
    }
});

app.get("/api/sheets/data", async (req, res) => {
    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.VITE_SPREADSHEET_ID,
            range: process.env.VITE_RANGE
        });
        res.json(response.data.values);
    } catch (error) {
        console.error('Sheets API Error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.put("/api/sheets/update/:row", async (req, res) => {
    try {
        const { row } = req.params;
        const { values } = req.body;
        
        await sheets.spreadsheets.values.update({
            spreadsheetId: process.env.VITE_SPREADSHEET_ID,
            range: `${process.env.VITE_RANGE}!A${row}:${String.fromCharCode(65 + values.length - 1)}${row}`,
            valueInputOption: 'RAW',
            requestBody: { values: [values] }
        });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const adminIds = process.env.ADMIN_DISCORD_IDS.split(',');

app.get("/api/permissions/:discordId", async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.json({ canEdit: false });
    }

    const adminIds = process.env.ADMIN_DISCORD_IDS.split(',').map(id => id.trim()) || [];
    // console.log(adminIds);
    const requestedUserIsAdmin = adminIds.includes(req.params.discordId);
    const currentUserIsAdmin = adminIds.includes(req.user.id);
    const isOwner = req.user.id === req.params.discordId;

    // Un admin peut modifier tous les utilisateurs sauf les autres admins
    // Un utilisateur normal ne peut modifier que ses propres skills
    let isValidToken = false;

    const response = await fetch(
        process.env.BASE_API_URL + `/session/isconnected?session_id=${req.user.id}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: process.env.API_TOKEN
            },
            credentials: "include",
        }
    );


    if (response.ok) {
        const data = await response.json();
        console.log("Réponse de /session/isconnected :", data);
        isValidToken = data.isConnected;
    }
    const canEdit = (currentUserIsAdmin && !requestedUserIsAdmin) || isOwner;

    res.json({
        canEdit: canEdit,
        isAdmin: currentUserIsAdmin,
        isValidToken: isValidToken,
    });
});


app.use(express.static(path.join(__dirname, "dist")));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});