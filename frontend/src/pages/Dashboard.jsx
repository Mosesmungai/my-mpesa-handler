import React, { useEffect, useState } from 'react';
import { TrendingUp, Users, CreditCard, DollarSign } from 'lucide-react';
import api from '../services/api';

const Dashboard = () => {
  const [data, setData] = useState({ stats: [], recent: [] });
  const [loading, setLoading] = useState(true);

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

  const stats = data.stats.length > 0 ? data.stats : [
    { label: 'Total Volume', value: 'KES 0.00', icon: <DollarSign />, trend: '0%' },
    { label: 'Transactions', value: '0', icon: <CreditCard />, trend: '0%' },
    { label: 'Active Systems', value: '0', icon: <Users />, trend: '0%' },
    { label: 'Success Rate', value: '0%', icon: <TrendingUp />, trend: '0%' },
  ];

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
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <th style={{ padding: '12px 0' }}>Transaction ID</th>
                <th>System</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((_, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--glass-border)', fontSize: '0.9rem' }}>
                  <td style={{ padding: '16px 0', fontFamily: 'monospace' }}>TRX-723{i}892</td>
                  <td>Main App</td>
                  <td>STK Push</td>
                  <td>KES 500.00</td>
                  <td>
                    <span style={{ padding: '4px 8px', background: 'rgba(0, 230, 118, 0.1)', color: 'var(--primary)', borderRadius: '4px', fontSize: '0.75rem' }}>SUCCESS</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="glass" style={{ padding: '24px' }}>
          <h3 style={{ marginBottom: '24px' }}>System Health</h3>
          {['Sandbox Environment', 'Production Live', 'Callback Worker'].map((item, i) => (
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
