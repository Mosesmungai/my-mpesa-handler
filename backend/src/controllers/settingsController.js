const db = require('../models/db');

/**
 * Get global settings
 */
const getSettings = async (req, res) => {
    try {
        const settings = await db.one('SELECT * FROM global_settings WHERE id = 1');
        res.json(settings);
    } catch (error) {
        console.error('Get Settings Error:', error.message);
        res.status(500).json({ error: 'Failed to fetch settings' });
    }
};

/**
 * Update global settings
 */
const updateSettings = async (req, res) => {
    const { maintenance_mode, default_callback_url, email_alerts_enabled, raw_logging_enabled } = req.body;
    
    try {
        await db.none(
            `UPDATE global_settings SET 
                maintenance_mode = $1, 
                default_callback_url = $2, 
                email_alerts_enabled = $3, 
                raw_logging_enabled = $4,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = 1`,
            [maintenance_mode, default_callback_url, email_alerts_enabled, raw_logging_enabled]
        );
        res.json({ success: true, message: 'Settings updated successfully' });
    } catch (error) {
        console.error('Update Settings Error:', error.message);
        res.status(500).json({ error: 'Failed to update settings' });
    }
};

module.exports = {
    getSettings,
    updateSettings
};
