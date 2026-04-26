-- MPesa API Gateway Database Schema

-- Users table for Dashboard Admins
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Systems table for storing M-Pesa credentials
CREATE TABLE IF NOT EXISTS systems (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    owner_id INTEGER REFERENCES users(id),
    consumer_key TEXT NOT NULL,
    consumer_secret TEXT NOT NULL,
    shortcode VARCHAR(20) NOT NULL,
    passkey TEXT,
    initiator_name VARCHAR(100),
    initiator_password TEXT,
    environment VARCHAR(10) DEFAULT 'sandbox', -- 'sandbox' or 'live'
    callback_url TEXT, -- External system's callback URL to forward responses to
    api_key VARCHAR(64) UNIQUE NOT NULL, -- Key for the external system to call this gateway
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Transactions table for logging all requests
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    system_id INTEGER REFERENCES systems(id),
    transaction_type VARCHAR(50) NOT NULL, -- 'STK_PUSH', 'C2B', 'B2C', etc.
    merchant_request_id VARCHAR(100),
    checkout_request_id VARCHAR(100),
    origin_response JSONB, -- Initial response from Daraja
    status VARCHAR(20) DEFAULT 'PENDING', -- 'PENDING', 'SUCCESS', 'FAILED'
    amount DECIMAL(10, 2),
    phone VARCHAR(20),
    reference VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Callbacks table for logging incoming Daraja callbacks
CREATE TABLE IF NOT EXISTS callbacks (
    id SERIAL PRIMARY KEY,
    transaction_id INTEGER REFERENCES transactions(id),
    raw_payload JSONB NOT NULL,
    normalized_payload JSONB,
    forwarded BOOLEAN DEFAULT FALSE,
    forward_response JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
