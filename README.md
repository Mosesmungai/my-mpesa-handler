# MPesa API Gateway & Dashboard

A robust, secure, and aesthetically premium middle-man gateway for Safaricom's Daraja APIs. Built with Node.js, Express, React, and PostgreSQL.

## Features
- **Secure Credential Storage**: AES-256 encryption for all sensitive Daraja keys.
- **Full Auth Layer**: Email/Password authentication for dashboard access.
- **Cloud Ready**: Configured for Render (Backend), Vercel (Frontend), and Neon (Database).
- **Real-time Analytics**: Live statistics on transaction volume and success rates.
- **Multi-Tenant**: Support for multiple independent M-Pesa systems.

## Tech Stack
- **Frontend**: React, Vite, Framer Motion, Lucide Icons.
- **Backend**: Node.js, Express, pg-promise, JWT.
- **Database**: PostgreSQL (Cloud hosted on Neon).

## Quick Start
1. Clone the repo and run `npm install` in both `backend` and `frontend` folders.
2. Set up your `.env` file in the backend with your `DATABASE_URL` and `ENCRYPTION_KEY`.
3. Run `npm run dev` in both folders.

## Deployment
- **Backend**: Deploy to Render using the `backend` root directory.
- **Frontend**: Deploy to Vercel using the `frontend` root directory.

---
Built by [Moses Mungai](https://github.com/Mosesmungai)
