import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, ArrowUpRight, ArrowDownLeft, Clock, Loader2 } from 'lucide-react';
import api from '../services/api';

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const { data } = await api.get('/dashboard/stats'); // We'll add a real logs endpoint next
        setLogs(data.recent || []);
      } catch (err) {
        console.error('Failed to fetch logs', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="animate-slide-up">
      <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1>Audit Logs</h1>
          <p>Complete history of all transactions passing through your gateway.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-outline"><Download size={18} /> Export CSV</button>
        </div>
      </header>

      <div className="glass" style={{ padding: '0px', overflow: 'hidden' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border)', display: 'flex', gap: '20px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input type="text" placeholder="Search by Phone or Receipt..." style={{ width: '100%', paddingLeft: '44px', background: 'transparent' }} />
          </div>
          <button className="btn btn-outline" style={{ padding: '10px 20px' }}><Filter size={18} /> Filter</button>
        </div>

        {loading ? (
          <div style={{ padding: '100px', textAlign: 'center' }}>
            <Loader2 className="animate-spin" size={40} color="var(--primary)" />
          </div>
        ) : logs.length === 0 ? (
          <div style={{ padding: '100px', textAlign: 'center' }}>
            <Clock size={48} style={{ margin: '0 auto 16px', color: 'var(--text-muted)' }} />
            <h3>No logs found</h3>
            <p>Transactions will appear here once you start using the gateway.</p>
          </div>
        ) : (
          <table style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Transaction</th>
                <th>System</th>
                <th>Phone</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: log.amount > 0 ? 'rgba(0, 255, 163, 0.1)' : 'rgba(93, 93, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {log.amount > 0 ? <ArrowDownLeft size={16} color="var(--primary)" /> : <ArrowUpRight size={16} color="var(--accent)" />}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600 }}>{log.reference}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{log.mpesa_receipt || 'No Receipt'}</div>
                      </div>
                    </div>
                  </td>
                  <td>{log.system_name}</td>
                  <td>{log.phone}</td>
                  <td style={{ fontWeight: 600, color: log.status === 'SUCCESS' ? 'var(--primary)' : 'inherit' }}>
                    KES {parseFloat(log.amount).toFixed(2)}
                  </td>
                  <td>
                    <span style={{ 
                      padding: '4px 10px', 
                      borderRadius: '20px', 
                      fontSize: '0.75rem', 
                      fontWeight: 600,
                      background: log.status === 'SUCCESS' ? 'rgba(0, 255, 163, 0.1)' : 'rgba(255, 62, 62, 0.1)',
                      color: log.status === 'SUCCESS' ? 'var(--primary)' : 'var(--error)'
                    }}>
                      {log.status}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Logs;
