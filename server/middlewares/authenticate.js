const comparePasswords = (password1, password2) => {
    return password1 === password2;
};

const authenticate = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) return res.status(403).json({ message: "Token manquant" });

    if (!comparePasswords(token, process.env.TOKEN)) {
        return res.status(403).json({ message: "Token invalide" });
    } else {
        next();
    }
};

module.exports = { authenticate };