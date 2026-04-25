import React, { useState, useEffect } from 'react';
import { Send, Smartphone, Shield, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';

const TestingPanel = () => {
  const [systems, setSystems] = useState([]);
  const [selectedSystem, setSelectedSystem] = useState('');
  const [formData, setFormData] = useState({ phone: '', amount: '1', reference: 'LAB_TEST', description: 'Testing from Dashboard' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchSystems = async () => {
      const { data } = await api.get('/systems');
      setSystems(data);
      if (data.length > 0) setSelectedSystem(data[0].id);
    };
    fetchSystems();
  }, []);

  const handleTest = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      // Find the selected system's API key (in a real app, you might have a dedicated internal test route)
      // For this demo, we'll use a special "internal" test endpoint or just pass the system_id
      const { data } = await api.post('/test/stkpush', {
        system_id: selectedSystem,
        ...formData
      });
      setResult({ success: true, ...data });
    } catch (err) {
      setResult({ success: false, error: err.response?.data?.error || 'Test failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-slide-up">
      <header style={{ marginBottom: '40px' }}>
        <h1>Testing Lab</h1>
        <p>Simulate transactions to verify your M-Pesa integration.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '40px' }}>
        <div className="glass" style={{ padding: '40px' }}>
          <h3 style={{ marginBottom: '32px' }}>Initiate STK Push Test</h3>
          <form onSubmit={handleTest} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '10px', color: 'var(--text-muted)' }}>Target System</label>
              <select 
                style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', padding: '14px', borderRadius: '12px', color: '#fff' }}
                value={selectedSystem}
                onChange={(e) => setSelectedSystem(e.target.value)}
              >
                {systems.map(s => <option key={s.id} value={s.id}>{s.name} ({s.environment})</option>)}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '10px', color: 'var(--text-muted)' }}>Phone Number (254...)</label>
                <div style={{ position: 'relative' }}>
                  <Smartphone size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input required type="text" placeholder="254712345678" style={{ width: '100%', paddingLeft: '44px' }} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '10px', color: 'var(--text-muted)' }}>Amount (KES)</label>
                <input required type="number" placeholder="1" style={{ width: '100%' }} defaultValue="1" onChange={(e) => setFormData({...formData, amount: e.target.value})} />
              </div>
            </div>

            <button type="submit" disabled={loading || !selectedSystem} className="btn btn-primary" style={{ height: '54px' }}>
              {loading ? <Loader2 className="animate-spin" /> : <Send size={20} />}
              Send STK Prompt
            </button>
          </form>
        </div>

        <div className="glass" style={{ padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          {!result && !loading && (
            <>
              <Shield size={64} color="var(--border)" style={{ marginBottom: '24px' }} />
              <h3 style={{ color: 'var(--text-muted)' }}>Ready for Test</h3>
              <p>Configure and send a request to see the response here.</p>
            </>
          )}

          {loading && (
            <>
              <Loader2 size={64} className="animate-spin" color="var(--primary)" style={{ marginBottom: '24px' }} />
              <h3>Processing Request</h3>
              <p>Communicating with Safaricom Daraja...</p>
            </>
          )}

          {result && (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              {result.success ? (
                <>
                  <CheckCircle size={64} color="var(--success)" style={{ marginBottom: '24px' }} />
                  <h3>Success!</h3>
                  <p style={{ marginBottom: '24px' }}>{result.message}</p>
                  <div className="glass" style={{ background: '#000', padding: '16px', borderRadius: '12px', fontSize: '0.8rem', textAlign: 'left', fontFamily: 'monospace' }}>
                    <pre>{JSON.stringify(result, null, 2)}</pre>
                  </div>
                </>
              ) : (
                <>
                  <XCircle size={64} color="var(--error)" style={{ marginBottom: '24px' }} />
                  <h3>Failed</h3>
                  <p>{result.error}</p>
                </>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestingPanel;
