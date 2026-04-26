const axios = require('axios');
const { decrypt } = require('../utils/encryption');

class MpesaService {
    constructor() {
        this.tokens = new Map(); // Cache tokens: { systemId: { token, expiry } }
    }

    /**
     * Get OAuth Token for a system
     * @param {Object} system - System object containing credentials
     * @returns {Promise<string>} - The OAuth token
     */
    async getAuthToken(system) {
        const now = Date.now();
        // Create a unique cache key based on ID and credentials
        const cacheKey = `${system.id}_${system.consumer_key.slice(-8)}`;
        const cached = this.tokens.get(cacheKey);

        if (cached && cached.expiry > now + 60000) {
            return cached.token;
        }

        const consumerKey = decrypt(system.consumer_key);
        const consumerSecret = decrypt(system.consumer_secret);
        
        const baseUrl = system.environment === 'live' 
            ? 'https://api.safaricom.co.ke' 
            : 'https://sandbox.safaricom.co.ke';

        
        const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

        try {
            const response = await axios.get(`${baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
                headers: {
                    Authorization: `Basic ${auth}`
                }
            });

            const { access_token, expires_in } = response.data;

            this.tokens.set(cacheKey, {
                token: access_token,
                expiry: now + (parseInt(expires_in) * 1000)
            });

            return access_token;
        } catch (error) {
            console.error('Mpesa Auth Error:', error.response?.data || error.message);
            throw new Error('Failed to generate Mpesa OAuth token');
        }
    }

    /**
     * Trigger STK Push
     */
    async stkPush(system, amount, phoneNumber, reference, description) {
        const token = await this.getAuthToken(system);
        const baseUrl = system.environment === 'live' 
            ? 'https://api.safaricom.co.ke' 
            : 'https://sandbox.safaricom.co.ke';

        // Safaricom expects EAT (UTC+3)
        const now = new Date();
        const eatOffset = 3 * 60 * 60 * 1000;
        const eatTime = new Date(now.getTime() + eatOffset);
        const timestamp = eatTime.toISOString().replace(/[^0-9]/g, '').slice(0, 14);
        const shortcode = system.shortcode.trim();
        
        // Use live passkey from DB or fallback to sandbox passkey from env
        const decryptedPasskey = system.passkey ? decrypt(system.passkey) : null;
        const passkey = (decryptedPasskey || process.env.SANDBOX_PASSKEY || '').trim();
        
        const password = Buffer.from(
            `${shortcode}${passkey}${timestamp}`
        ).toString('base64');

        // Sanitize reference and description (max 12 characters for reference is safest for some systems)
        const safeReference = (reference || 'Payment').toString().replace(/[^a-zA-Z0-9]/g, '').slice(0, 12);
        const safeDescription = (description || 'Gateway Payment').toString().slice(0, 32);

        // Fix potential double slashes in CallBackURL
        const gatewayUrl = (process.env.GATEWAY_URL || '').replace(/\/+$/, '');
        const callbackUrl = `${gatewayUrl}/api/v1/callbacks/stk`;

        const payload = {
            BusinessShortCode: shortcode,
            Password: password,
            Timestamp: timestamp,
            TransactionType: 'CustomerPayBillOnline',
            Amount: Math.round(amount), // Ensure it's an integer
            PartyA: phoneNumber.trim(),
            PartyB: shortcode,
            PhoneNumber: phoneNumber.trim(),
            CallBackURL: callbackUrl,
            AccountReference: safeReference,
            TransactionDesc: safeDescription
        };

        try {
            const response = await axios.post(`${baseUrl}/mpesa/stkpush/v1/processrequest`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            const errorDetail = error.response?.data || error.message;
            console.error('M-Pesa STK Push Error Details:', JSON.stringify(errorDetail, null, 2));
            throw new Error(errorDetail.errorMessage || errorDetail.errorMessage || 'M-Pesa STK Push failed');
        }
    }

    // Add other methods (C2B, B2C, etc.) as needed...
}

module.exports = new MpesaService();
