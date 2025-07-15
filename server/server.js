const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const {isTokenValid, createToken, getUserFromToken} = require("./services/auth")
const PORT = 3000;

dotenv.config();
/*
//api/skill
app.use("/*", (req, res, next)=>{
    ///recupere cookie
    //verifier cookie
    //lire depuis le user
    //req.user = userDiscord;
    next();
})*/

app.use(cookieParser());


app.post('/login', (req, res) => {
    const payload = { userId: 1 };

    const token = createToken(payload);
    res.cookie('accessToken', token, {
        httpOnly: true,
        maxAge: 3600000, // 1 hour
        sameSite: 'Strict'
    });
    res.json({ accessToken: token });
});

app.get('/validate-token', (req, res) => {
    const token = req.cookies['accessToken'];

    if (!token)
        return res.status(403).json({ error: 'Token is required' });

    const isValid = isTokenValid(token);

    if (isValid)
        res.json({ message: 'Token is valid' });
    else
        res.status(401).json({ error: 'Invalid or expired token' });

});

app.get('/profile', (req, res) => {
    const token = req.cookies['accessToken'];

    if (!token)
        return res.status(403).json({ error: 'Token is required' });

    try {
        const user = getUserFromToken(token);
        res.json({ message: 'Authenticated', user });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});
/*
app.post(...., ()=>[
    const user = req.user;
user.id
])*/

app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
