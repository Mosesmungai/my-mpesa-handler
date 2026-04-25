const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

/**
 * Middleware to authenticate dashboard users via JWT
 */
const authenticateUser = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
};

/**
 * Middleware to authenticate external systems via API Key
 */
const authenticateSystem = async (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey) {
        return res.status(401).json({ error: 'Unauthorized: API Key required' });
    }

    // In a real app, you'd fetch the system from the DB and cache it
    const db = require('../models/db');
    try {
        const system = await db.oneOrNone('SELECT * FROM systems WHERE api_key = $1', [apiKey]);
        if (!system) {
            return res.status(401).json({ error: 'Unauthorized: Invalid API Key' });
        }
        req.system = system;
        next();
    } catch (error) {
        console.error('System Auth Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    authenticateUser,
    authenticateSystem
};
