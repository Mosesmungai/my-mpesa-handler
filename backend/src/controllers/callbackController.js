const db = require('../models/db');
const axios = require('axios');

/**
 * Error Code Mapping (Friendly Messages)
 */
const ERROR_MESSAGES = {
    '0': 'Success',
    '1': 'The request was rejected by M-Pesa.',
    '17': 'Too many requests. Please try again later.',
    '1032': 'Transaction cancelled by user.',
    '1037': 'DS timeout user cannot be reached.',
    '2001': 'Insufficient funds.',
    '2002': 'Invalid M-Pesa recipient.',
    '2010': 'The caller is not allowed to access this resource.',
    '2011': 'Expired QR code.',
    '2012': 'Invalid transaction.',
    '2023': 'Security risk flagged.',
};

/**
 * Handle STK Callback from Safaricom
 */
const handleSTKCallback = async (req, res) => {
    const { Body } = req.body;
    const { token } = req.query; // Security token from URL
    
    console.log('Received STK Callback:', JSON.stringify(Body, null, 2));

    // Acknowledge receipt to Safaricom immediately
    res.status(200).json({ ResultCode: 0, ResultDesc: "Success" });

    if (!Body || !Body.stkCallback) return;

    const stkResult = Body.stkCallback;
    const checkoutRequestID = stkResult.CheckoutRequestID;

    try {
        // 1. Find the transaction in our DB
        const transaction = await db.oneOrNone(
            'SELECT * FROM transactions WHERE checkout_request_id = $1',
            [checkoutRequestID]
        );

        if (!transaction) {
            console.error('Transaction not found for ID:', checkoutRequestID);
            return;
        }

        // 2. Security Check - Verify Token
        if (transaction.callback_token && transaction.callback_token !== token) {
            console.warn(`Security Alert: Invalid callback token for transaction ${transaction.id}`);
            return;
        }

        // 3. Normalize the payload
        const friendlyDesc = ERROR_MESSAGES[stkResult.ResultCode.toString()] || stkResult.ResultDesc;
        const normalized = {
            merchant_request_id: stkResult.MerchantRequestID,
            checkout_request_id: stkResult.CheckoutRequestID,
            result_code: stkResult.ResultCode,
            result_desc: friendlyDesc,
            status: stkResult.ResultCode === 0 ? 'SUCCESS' : 'FAILED',
            amount: transaction.amount,
            phone: transaction.phone,
            reference: transaction.reference,
            metadata: {}
        };

        if (stkResult.CallbackMetadata) {
            stkResult.CallbackMetadata.Item.forEach(item => {
                normalized.metadata[item.Name] = item.Value;
            });
        }

        // 4. Update transaction status
        await db.none(
            'UPDATE transactions SET status = $1, result_desc = $2, origin_response = $3 WHERE id = $4',
            [normalized.status, friendlyDesc, stkResult, transaction.id]
        );

        // 5. Log callback
        const callbackEntry = await db.one(
            'INSERT INTO callbacks (transaction_id, raw_payload, normalized_payload) VALUES ($1, $2, $3) RETURNING id',
            [transaction.id, req.body, normalized]
        );

        // 6. Forward to external system
        const system = await db.one('SELECT callback_url FROM systems WHERE id = $1', [transaction.system_id]);
        const globalSettings = await db.one('SELECT default_callback_url FROM global_settings WHERE id = 1');
        const targetUrl = system.callback_url || globalSettings.default_callback_url;
        
        if (targetUrl) {
            try {
                const forwardRes = await axios.post(targetUrl, normalized, { timeout: 5000 });
                await db.none(
                    'UPDATE callbacks SET forwarded = TRUE, forward_response = $1 WHERE id = $2',
                    [forwardRes.data, callbackEntry.id]
                );
            } catch (err) {
                console.error('Failed to forward callback:', err.message);
                await db.none(
                    'UPDATE callbacks SET forward_response = $1 WHERE id = $2',
                    [{ error: err.message }, callbackEntry.id]
                );
            }
        }
    } catch (error) {
        console.error('Error processing STK callback:', error.message);
    }
};

module.exports = {
    handleSTKCallback
};
