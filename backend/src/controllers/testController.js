const db = require('../models/db');
const mpesaService = require('../services/mpesaService');
const { decrypt } = require('../utils/encryption');
const crypto = require('crypto');

/**
 * Handle STK Push Test Request from Dashboard
 */
const testSTKPush = async (req, res) => {
    const { system_id, phone, amount, reference, description } = req.body;

    try {
        // 1. Fetch system details (ensure user owns the system)
        const system = await db.oneOrNone(
            'SELECT * FROM systems WHERE id = $1 AND owner_id = $2', 
            [system_id, req.user.id]
        );

        if (!system) {
            return res.status(404).json({ error: 'System not found or unauthorized' });
        }


        // 2. Generate security token for callback verification
        const callbackToken = crypto.randomUUID();

        // 3. Initiate push using the mpesaService singleton
        const result = await mpesaService.stkPush(system, amount, phone, reference, description, callbackToken);

        // 4. Log the test transaction (Include callback_token)
        await db.none(
            `INSERT INTO transactions (system_id, transaction_type, merchant_request_id, checkout_request_id, amount, phone, reference, status, callback_token) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
            [system.id, 'STK_TEST', result.MerchantRequestID, result.CheckoutRequestID, amount, phone, reference, 'PENDING', callbackToken]
        );

        res.json({
            success: true,
            message: 'STK Prompt sent successfully. Check your phone.',
            CheckoutRequestID: result.CheckoutRequestID
        });

    } catch (error) {
        console.error('Test STK Controller Error:', error.message);
        res.status(500).json({ error: error.message || 'Server error during M-Pesa test' });
    }
};

module.exports = {
    testSTKPush
};
