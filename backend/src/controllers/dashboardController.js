const db = require('../models/db');

/**
 * Get aggregated stats for the dashboard
 */
const getDashboardStats = async (req, res) => {
    try {
        // Total Volume & Transaction Count
        const volumeData = await db.one(`
            SELECT 
                COALESCE(SUM(amount), 0) as total_volume,
                COUNT(*) as total_transactions,
                COUNT(DISTINCT system_id) as active_systems
            FROM transactions 
            WHERE status = 'SUCCESS'
        `);

        // Success Rate
        const rateData = await db.one(`
            SELECT 
                (COUNT(*) FILTER (WHERE status = 'SUCCESS')::float / NULLIF(COUNT(*), 0)::float) * 100 as success_rate
            FROM transactions
        `);

        // Recent Transactions
        const recent = await db.any(`
            SELECT t.*, s.name as system_name 
            FROM transactions t 
            JOIN systems s ON t.system_id = s.id 
            ORDER BY t.created_at DESC 
            LIMIT 5
        `);

        res.json({
            stats: [
                { label: 'Total Volume', value: `KES ${parseFloat(volumeData.total_volume).toLocaleString()}`, icon: 'DollarSign', trend: '+0%' },
                { label: 'Transactions', value: volumeData.total_transactions, icon: 'CreditCard', trend: '+0%' },
                { label: 'Active Systems', value: volumeData.active_systems, icon: 'Users', trend: '0%' },
                { label: 'Success Rate', value: `${Math.round(rateData.success_rate || 0)}%`, icon: 'TrendingUp', trend: '+0%' },
            ],
            recent
        });
    } catch (error) {
        console.error('Stats Fetch Error:', error.message);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
};

module.exports = {
    getDashboardStats
};
