const mpesaService = require('../services/mpesaService');
const db = require('../models/db');

/**
 * Handle STK Push Request from external system
 */
const initiateSTKPush = async (req, res) => {
    const { amount, phone, reference, description } = req.body;
    const system = req.system; // Provided by authenticateSystem middleware

    if (!amount || !phone || !reference) {
        return res.status(400).json({ error: 'Missing required fields: amount, phone, reference' });
    }

    try {
        const response = await mpesaService.stkPush(system, amount, phone, reference, description || 'Payment');
        
        // Log transaction to DB
        await db.none(
            `INSERT INTO transactions (system_id, transaction_type, merchant_request_id, checkout_request_id, origin_response, amount, phone_number, reference) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [
                system.id, 
                'STK_PUSH', 
                response.MerchantRequestID, 
                response.CheckoutRequestID, 
                response, 
                amount, 
                phone, 
                reference
            ]
        );

        res.json({
            success: true,
            merchant_request_id: response.MerchantRequestID,
            checkout_request_id: response.CheckoutRequestID,
            message: response.CustomerMessage
        });
    } catch (error) {
        console.error('STK Push Error:', error.message);
        res.status(500).json({ 
            error: 'Failed to initiate STK Push', 
            details: error.response?.data || error.message 
        });
    }
};

module.exports = {
    initiateSTKPush
};
