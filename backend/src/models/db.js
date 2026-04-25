const pgp = require('pg-promise')();
require('dotenv').config();

const cn = process.env.DATABASE_URL || {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'mpesa_gateway',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres'
};

const db = pgp(cn);

module.exports = db;
