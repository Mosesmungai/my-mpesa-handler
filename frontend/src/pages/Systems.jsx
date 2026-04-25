import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, ShieldCheck, Globe, Loader2 } from 'lucide-react';
import api from '../services/api';

const Systems = () => {
  const [systems, setSystems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    consumerKey: '',
    consumerSecret: '',
    shortcode: '174379',
    passkey: '',
    environment: 'sandbox'
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSystems = async () => {
      try {
        const { data } = await api.get('/systems');
        setSystems(data);
      } catch (err) {
        console.error('Failed to fetch systems', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSystems();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.post('/systems', formData);
      setSystems([...systems, { ...formData, ...data }]);
      setShowAdd(false);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to add system');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <header style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>M-Pesa Systems</h1>
          <p>Manage your Daraja credentials and API keys.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
          <Plus size={20} />
          Add New System
        </button>
      </header>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
          <Loader2 className="animate-spin" size={40} color="var(--primary)" />
        </div>
      ) : systems.length === 0 ? (
        <div className="glass" style={{ padding: '80px', textAlign: 'center' }}>
          <ShieldCheck size={48} style={{ margin: '0 auto 16px', color: 'var(--text-muted)' }} />
          <h3>No systems found</h3>
          <p>Click "Add New System" to get started with Daraja.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '24px' }}>
          {systems.map((system) => (
            <div key={system.id} className="glass" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Globe size={20} color="var(--primary)" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem' }}>{system.name}</h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {system.id}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn btn-outline" style={{ padding: '8px' }}><Edit2 size={16} /></button>
                  <button className="btn btn-outline" style={{ padding: '8px', color: 'var(--error)' }}><Trash2 size={16} /></button>
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Environment</span>
                  <span style={{ color: system.environment === 'live' ? 'var(--primary)' : '#ffab00', textTransform: 'capitalize' }}>{system.environment}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Shortcode</span>
                  <span>{system.shortcode}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '16px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>API Key</span>
                  <span style={{ fontFamily: 'monospace' }}>{system.api_key}</span>
                </div>
              </div>

              <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border)', display: 'flex', gap: '8px' }}>
                <button className="btn btn-outline" style={{ width: '100%', fontSize: '0.8rem' }}>View Logs</button>
                <button className="btn btn-outline" style={{ width: '100%', fontSize: '0.8rem' }}>Test Connection</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAdd && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <form onSubmit={handleAdd} className="glass" style={{ width: '500px', padding: '32px' }}>
            <h2 style={{ marginBottom: '24px' }}>Add New M-Pesa System</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '8px', color: 'var(--text-muted)' }}>System Name</label>
                <input required type="text" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', padding: '12px', borderRadius: '8px', color: '#fff' }} placeholder="e.g. Mobile App" onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '8px', color: 'var(--text-muted)' }}>Environment</label>
                  <select
                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', padding: '12px', borderRadius: '8px', color: '#fff' }}
                    value={formData.environment}
                    onChange={(e) => {
                      const env = e.target.value;
                      setFormData({
                        ...formData,
                        environment: env,
                        shortcode: env === 'sandbox' ? '174379' : formData.shortcode
                      });
                    }}
                  >
                    <option value="sandbox">Sandbox</option>
                    <option value="live">Live</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '8px', color: 'var(--text-muted)' }}>Shortcode</label>
                  <input
                    required
                    type="text"
                    value={formData.shortcode}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', padding: '12px', borderRadius: '8px', color: '#fff' }}
                    placeholder="e.g. 174379"
                    onChange={(e) => setFormData({ ...formData, shortcode: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '8px', color: 'var(--text-muted)' }}>Consumer Key</label>
                <input required type="text" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', padding: '12px', borderRadius: '8px', color: '#fff' }} onChange={(e) => setFormData({ ...formData, consumerKey: e.target.value })} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '8px', color: 'var(--text-muted)' }}>Consumer Secret</label>
                <input required type="password" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', padding: '12px', borderRadius: '8px', color: '#fff' }} onChange={(e) => setFormData({ ...formData, consumerSecret: e.target.value })} />
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button type="submit" disabled={saving} className="btn btn-primary" style={{ flex: 1 }}>{saving ? 'Saving...' : 'Save Credentials'}</button>
                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowAdd(false)}>Cancel</button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Systems;
