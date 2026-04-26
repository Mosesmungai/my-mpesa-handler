const db = require('../models/db');
const axios = require('axios');

/**
 * Handle STK Callback from Safaricom
 */
const handleSTKCallback = async (req, res) => {
    const { Body } = req.body;
    console.log('Received STK Callback:', JSON.stringify(Body, null, 2));

    // Acknowledge receipt to Safaricom immediately
    res.status(200).send('OK');

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

        // 2. Normalize the payload
        const normalized = {
            merchant_request_id: stkResult.MerchantRequestID,
            checkout_request_id: stkResult.CheckoutRequestID,
            result_code: stkResult.ResultCode,
            result_desc: stkResult.ResultDesc,
            status: stkResult.ResultCode === 0 ? 'SUCCESS' : 'FAILED',
            metadata: {}
        };

        if (stkResult.CallbackMetadata) {
            stkResult.CallbackMetadata.Item.forEach(item => {
                normalized.metadata[item.Name] = item.Value;
            });
        }

        // 3. Update transaction status
        await db.none(
            'UPDATE transactions SET status = $1 WHERE id = $2',
            [normalized.status, transaction.id]
        );

        // 4. Log callback
        const callbackEntry = await db.one(
            'INSERT INTO callbacks (transaction_id, raw_payload, normalized_payload) VALUES ($1, $2, $3) RETURNING id',
            [transaction.id, req.body, normalized]
        );

        // 5. Forward to external system if callback_url exists
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
