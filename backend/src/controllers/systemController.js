const db = require('../models/db');
const { encrypt, decrypt } = require('../utils/encryption');
const crypto = require('crypto');

/**
 * Get all systems for a user
 */
const getSystems = async (req, res) => {
    try {
        const systems = await db.any('SELECT id, name, shortcode, environment, api_key, created_at FROM systems WHERE owner_id = $1', [req.user.id]);
        res.json(systems);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch systems' });
    }
};

/**
 * Add a new system
 */
const addSystem = async (req, res) => {
    const { name, consumerKey, consumerSecret, shortcode, passkey, environment, callbackUrl } = req.body;

    if (!name || !consumerKey || !consumerSecret || !shortcode) {
        return res.status(400).json({ error: 'Name, Keys and Shortcode are required' });
    }

    try {
        const apiKey = `gwy_${crypto.randomBytes(24).toString('hex')}`;
        const newSystem = await db.one(
            `INSERT INTO systems (name, owner_id, consumer_key, consumer_secret, shortcode, passkey, environment, callback_url, api_key) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id, api_key`,
            [
                name, 
                req.user.id, 
                encrypt(consumerKey), 
                encrypt(consumerSecret), 
                shortcode, 
                encrypt(passkey), 
                environment || 'sandbox', 
                callbackUrl, 
                apiKey
            ]
        );

        res.status(201).json({ success: true, ...newSystem });
    } catch (error) {
        console.error('Add System Error:', error.message);
        res.status(500).json({ error: 'Failed to add system' });
    }
};

/**
 * Delete a system
 */
const deleteSystem = async (req, res) => {
    try {
        await db.none('DELETE FROM systems WHERE id = $1 AND owner_id = $2', [req.params.id, req.user.id]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete system' });
    }
};

/**
 * Test connectivity for a system (Generate OAuth Token)
 */
const testConnection = async (req, res) => {
    try {
        const system = await db.oneOrNone('SELECT * FROM systems WHERE id = $1 AND owner_id = $2', [req.params.id, req.user.id]);
        if (!system) return res.status(404).json({ error: 'System not found' });

        const mpesaService = require('../services/mpesaService');
        const token = await mpesaService.getAuthToken(system);
        
        res.json({ success: true, message: 'Connection successful! OAuth token generated.' });
    } catch (error) {
        res.status(400).json({ error: 'Connection failed: ' + (error.message || 'Invalid credentials') });
    }
};

module.exports = {
    getSystems,
    addSystem,
    deleteSystem,
    testConnection
};
