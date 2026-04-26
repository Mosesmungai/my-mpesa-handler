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
                expiry: now + (Number.parseInt(expires_in, 10) * 1000)
            });

            return access_token;
        } catch (error) {
            console.error('Mpesa Auth Error:', error.response?.data || error.message);
            throw new Error('Failed to generate Mpesa OAuth token');
        }
    }

    /**
     * Normalize phone number to 254...
     */
    normalizePhone(phone) {
        let normalized = phone.toString().replaceAll(/\D/g, ''); // Remove non-digits
        if (normalized.startsWith('0')) {
            normalized = '254' + normalized.substring(1);
        } else if (normalized.startsWith('7') || normalized.startsWith('1')) {
            normalized = '254' + normalized;
        } else if (normalized.startsWith('254')) {
            // Already normalized
        }
        return normalized;
    }

    /**
     * Trigger STK Push
     */
    async stkPush(system, amount, phoneNumber, reference, description, callbackToken = null) {
        const token = await this.getAuthToken(system);
        const baseUrl = system.environment === 'live' 
            ? 'https://api.safaricom.co.ke' 
            : 'https://sandbox.safaricom.co.ke';

        // Safaricom expects EAT (UTC+3)
        const now = new Date();
        const eatOffset = 3 * 60 * 1000 * 60;
        const eatTime = new Date(now.getTime() + eatOffset);
        const timestamp = eatTime.toISOString().replaceAll(/\D/g, '').slice(0, 14);
        const shortcode = system.shortcode.trim();
        const normalizedPhone = this.normalizePhone(phoneNumber);
        
        // Use live passkey from DB or fallback to sandbox passkey from env
        const decryptedPasskey = system.passkey ? decrypt(system.passkey) : null;
        const passkey = (decryptedPasskey || process.env.SANDBOX_PASSKEY || '').trim();
        
        const password = Buffer.from(
            `${shortcode}${passkey}${timestamp}`
        ).toString('base64');

        // Sanitize reference and description
        const safeReference = (reference || 'Payment').toString().replaceAll(/[^a-zA-Z0-9]/g, '').slice(0, 12);
        const safeDescription = (description || 'Gateway Payment').toString().slice(0, 13); // Safe limit for Daraja

        // Fix potential double slashes in CallBackURL and add token for security
        const gatewayUrl = (process.env.GATEWAY_URL || '').replaceAll(/\/+$/, '');
        let callbackUrl = `${gatewayUrl}/api/v1/callbacks/stk`;
        if (callbackToken) {
            callbackUrl += `?token=${callbackToken}`;
        }

        const payload = {
            BusinessShortCode: shortcode,
            Password: password,
            Timestamp: timestamp,
            TransactionType: 'CustomerPayBillOnline',
            Amount: Math.round(amount),
            PartyA: normalizedPhone,
            PartyB: shortcode,
            PhoneNumber: normalizedPhone,
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
            throw new Error(errorDetail.errorMessage || 'M-Pesa STK Push failed');
        }
    }

    // Add other methods (C2B, B2C, etc.) as needed...
}

module.exports = new MpesaService();
