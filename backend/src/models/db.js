const pgp = require('pg-promise')();
require('dotenv').config();

const cn = process.env.DATABASE_URL;

if (!cn) {
    console.error('DATABASE_URL is missing! Please provide it in environment variables.');
    process.exit(1);
}

const db = pgp(cn);

module.exports = db;
