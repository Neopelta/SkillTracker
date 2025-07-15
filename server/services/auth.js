const jwt = require("jsonwebtoken");

const payload = {
    "userId" : 1,
}

const tokenOptions = {
    expiresIn: '1h',
    subject: payload.userId.toString()
}

function createToken() {
    return jwt.sign(payload, process.env.SECRET_TOKEN_KEY, tokenOptions);
}

function getUserFromToken(token) {
    try {
        const decoded = jwt.verify(token, process.env.SECRET_TOKEN_KEY);
        return {
            userId: decoded.userId,
        };
    } catch (error) {
        console.error("Token verification failed:", error);
        throw new Error("Invalid or expired token");
    }
}

function isTokenValid(token) {
    try {
        const decoded = jwt.decode(token, { complete: true });

        if (!decoded)
            return false;

        const expirationDate = decoded.payload.exp ? new Date(decoded.payload.exp * 1000) : null;
        const currentDate = new Date();

        return !(expirationDate && currentDate > expirationDate);

    } catch (error) {
        console.error("Token validation failed:", error.message);
        return false;
    }
}

module.exports = {
    createToken,
    getUserFromToken,
    isTokenValid,
}