const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const { authenticateSystem, authenticateUser } = require('./middleware/auth');
const transactionController = require('./controllers/transactionController');
const callbackController = require('./controllers/callbackController');

const authController = require('./controllers/authController');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes - Auth
app.post('/api/v1/auth/register', authController.register);
app.post('/api/v1/auth/login', authController.login);

// Routes - Gateway (API for external systems)
app.post('/api/v1/stkpush', authenticateSystem, transactionController.initiateSTKPush);
// app.post('/api/v1/c2b/register', authenticateSystem, ...);
// app.post('/api/v1/b2c/payment', authenticateSystem, ...);

// Routes - Callbacks (Incoming from Daraja)
app.post('/api/v1/callbacks/stk', callbackController.handleSTKCallback);

// Routes - Dashboard API (Protected via JWT)
// app.get('/api/v1/dashboard/stats', authenticateUser, ...);
// app.get('/api/v1/systems', authenticateUser, ...);
// app.post('/api/v1/systems', authenticateUser, ...);

// Health Check
app.get('/health', (req, res) => res.json({ status: 'OK', timestamp: new Date() }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`MPesa Gateway running on port ${PORT}`);
});
