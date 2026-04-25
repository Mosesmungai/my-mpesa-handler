const CryptoJS = require('crypto-js');
require('dotenv').config();

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default_secret_key_change_me';

/**
 * Encrypts a string using AES-256
 * @param {string} text - The text to encrypt
 * @returns {string} - The encrypted hex string
 */
const encrypt = (text) => {
    if (!text) return null;
    return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
};

/**
 * Decrypts an AES-256 encrypted string
 * @param {string} ciphertext - The encrypted string
 * @returns {string} - The original text
 */
const decrypt = (ciphertext) => {
    if (!ciphertext) return null;
    const bytes = CryptoJS.AES.decrypt(ciphertext, ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
};

module.exports = {
    encrypt,
    decrypt
};
