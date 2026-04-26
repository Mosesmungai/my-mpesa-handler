import React, { useEffect, useState } from 'react';
import { TrendingUp, Users, CreditCard, DollarSign } from 'lucide-react';
import api from '../services/api';

const Dashboard = () => {
  const [data, setData] = useState({ stats: [], recent: [] });
  const [loading, setLoading] = useState(true);

  const iconMap = {
    DollarSign: <DollarSign />,
    CreditCard: <CreditCard />,
    Users: <Users />,
    TrendingUp: <TrendingUp />
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/dashboard/stats');
        setData(data);
      } catch (err) {
        console.error('Failed to fetch dashboard stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const stats = data.stats.length > 0 ? data.stats.map(s => ({
    ...s,
    icon: iconMap[s.icon] || <Activity />
  })) : [
    { label: 'Total Volume', value: 'KES 0.00', icon: <DollarSign />, trend: '0%' },
    { label: 'Transactions', value: '0', icon: <CreditCard />, trend: '0%' },
    { label: 'Active Systems', value: '0', icon: <Users />, trend: '0%' },
    { label: 'Success Rate', value: '0%', icon: <TrendingUp />, trend: '0%' },
  ];

  const recentTransactions = data.recent.length > 0 ? data.recent : [];

  return (
    <div className="animate-fade-in">
      <header style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Dashboard Overview</h1>
        <p>Monitor your M-Pesa gateway activity across all systems.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        {stats.map((stat, i) => (
          <div key={i} className="glass" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', color: 'var(--primary)' }}>
                {stat.icon}
              </div>
              <span style={{ color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 600 }}>{stat.trend}</span>
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{stat.value}</h3>
            <p style={{ fontSize: '0.9rem' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div className="glass" style={{ padding: '24px', minHeight: '400px' }}>
          <h3 style={{ marginBottom: '24px' }}>Recent Transactions</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  <th style={{ padding: '12px 0' }}>Reference</th>
                  <th>System</th>
                  <th>Phone</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.length > 0 ? recentTransactions.map((trx, i) => (
                  <tr key={trx.id} style={{ borderBottom: '1px solid var(--glass-border)', fontSize: '0.9rem' }}>
                    <td style={{ padding: '16px 0', fontFamily: 'monospace' }}>{trx.reference}</td>
                    <td>{trx.system_name}</td>
                    <td>{trx.phone}</td>
                    <td>KES {parseFloat(trx.amount).toLocaleString()}</td>
                    <td>
                      <span style={{ 
                        padding: '4px 8px', 
                        background: trx.status === 'SUCCESS' ? 'rgba(0, 230, 118, 0.1)' : 'rgba(255, 62, 62, 0.1)', 
                        color: trx.status === 'SUCCESS' ? 'var(--primary)' : 'var(--error)', 
                        borderRadius: '4px', fontSize: '0.75rem' 
                      }}>
                        {trx.status}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>No recent transactions</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass" style={{ padding: '24px' }}>
          <h3 style={{ marginBottom: '24px' }}>System Health</h3>
          {['Gateway Core', 'Database Instance', 'Callback Listener'].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)' }}></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>{item}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Operational</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
