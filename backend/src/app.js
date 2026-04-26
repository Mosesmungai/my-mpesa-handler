const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const { authenticateSystem, authenticateUser } = require('./middleware/auth');
const transactionController = require('./controllers/transactionController');
const callbackController = require('./controllers/callbackController');
const authController = require('./controllers/authController');
const dashboardController = require('./controllers/dashboardController');
const systemController = require('./controllers/systemController');
const testController = require('./controllers/testController');
const settingsController = require('./controllers/settingsController');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Maintenance Mode Middleware
app.use(async (req, res, next) => {
    // Skip check for settings and health
    if (req.path.startsWith('/api/v1/settings') || req.path === '/health' || req.path === '/') {
        return next();
    }
    
    try {
        const db = require('./models/db');
        const settings = await db.oneOrNone('SELECT maintenance_mode FROM global_settings WHERE id = 1');
        if (settings?.maintenance_mode && !req.path.includes('/auth')) {
            return res.status(503).json({ error: 'System is currently under maintenance. Please try again later.' });
        }
        next();
    } catch (error) {
        next(); // Proceed if DB check fails
    }
});

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
app.get('/api/v1/dashboard/stats', authenticateUser, dashboardController.getDashboardStats);
app.get('/api/v1/dashboard/logs', authenticateUser, dashboardController.getLogs);
app.get('/api/v1/systems', authenticateUser, systemController.getSystems);
app.post('/api/v1/systems', authenticateUser, systemController.addSystem);
app.put('/api/v1/systems/:id', authenticateUser, systemController.updateSystem);
app.delete('/api/v1/systems/:id', authenticateUser, systemController.deleteSystem);
app.get('/api/v1/systems/:id/test', authenticateUser, systemController.testConnection);
app.post('/api/v1/test/stkpush', authenticateUser, testController.testSTKPush);

// Routes - Settings
app.get('/api/v1/settings', authenticateUser, settingsController.getSettings);
app.put('/api/v1/settings', authenticateUser, settingsController.updateSettings);

// Root Route
app.get('/', (req, res) => res.json({ 
  message: 'Welcome to the MPesa API Gateway', 
  docs: 'https://github.com/Mosesmungai/my-mpesa-handler',
  status: 'Running'
}));

// Health Check
app.get('/health', (req, res) => res.json({ status: 'OK', timestamp: new Date() }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`MPesa Gateway running on port ${PORT}`);
});
