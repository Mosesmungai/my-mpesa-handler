import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, ShieldCheck, Globe, Loader2, CheckCircle, XCircle } from 'lucide-react';
import api from '../services/api';

const Systems = () => {
  const [systems, setSystems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editingSystem, setEditingSystem] = useState(null);
  const [formData, setFormData] = useState({ name: '', consumerKey: '', consumerSecret: '', shortcode: '174379', passkey: '', environment: 'sandbox' });
  const [saving, setSaving] = useState(false);
  const [testingId, setTestingId] = useState(null);
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    fetchSystems();
  }, []);

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

  const handleOpenAdd = () => {
    setEditingSystem(null);
    setFormData({ name: '', consumerKey: '', consumerSecret: '', shortcode: '174379', passkey: '', environment: 'sandbox' });
    setShowAdd(true);
  };

  const handleOpenEdit = (system) => {
    setEditingSystem(system);
    setFormData({ 
      name: system.name, 
      consumerKey: '', // Don't show old keys for security
      consumerSecret: '', 
      shortcode: system.shortcode, 
      passkey: '', 
      environment: system.environment 
    });
    setShowAdd(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingSystem) {
        await api.put(`/systems/${editingSystem.id}`, formData);
      } else {
        await api.post('/systems', formData);
      }
      fetchSystems();
      setShowAdd(false);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to save system');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this system? This will also revoke its API key access.')) return;
    try {
      await api.delete(`/systems/${id}`);
      setSystems(systems.filter(s => s.id !== id));
    } catch (err) {
      alert('Failed to delete system');
    }
  };

  const handleTestConnection = async (id) => {
    setTestingId(id);
    setTestResult(null);
    try {
      const { data } = await api.get(`/systems/${id}/test`);
      setTestResult({ id, success: true, message: data.message });
      setTimeout(() => setTestResult(null), 5000);
    } catch (err) {
      setTestResult({ id, success: false, message: err.response?.data?.error || 'Connection failed' });
    } finally {
      setTestingId(null);
    }
  };

  return (
    <div className="animate-fade-in">
      <header style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>M-Pesa Systems</h1>
          <p>Manage your Daraja credentials and API keys.</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenAdd}>
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '24px' }}>
          {systems.map((system) => (
            <div key={system.id} className="glass" style={{ padding: '24px', position: 'relative' }}>
              {testResult?.id === system.id && (
                <div style={{ 
                  position: 'absolute', inset: 0, background: 'rgba(5, 5, 5, 0.95)', 
                  borderRadius: '20px', display: 'flex', flexDirection: 'column', 
                  alignItems: 'center', justifyContent: 'center', zIndex: 10, padding: '20px', textAlign: 'center'
                }}>
                  {testResult.success ? <CheckCircle size={40} color="var(--primary)" /> : <XCircle size={40} color="var(--error)" />}
                  <div style={{ marginTop: '12px', fontWeight: 600 }}>{testResult.success ? 'Success' : 'Failed'}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>{testResult.message}</div>
                  <button className="btn btn-outline" style={{ marginTop: '16px', padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => setTestResult(null)}>Close</button>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ width: '40px', height: '40px', background: 'rgba(0, 255, 163, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Globe size={20} color="var(--primary)" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.2rem' }}>{system.name}</h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {system.api_key.split('_')[1].slice(0, 8)}...</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn btn-outline" style={{ padding: '8px' }} onClick={() => handleOpenEdit(system)}><Edit2 size={16} /></button>
                  <button className="btn btn-outline" style={{ padding: '8px', color: 'var(--error)' }} onClick={() => handleDelete(system.id)}><Trash2 size={16} /></button>
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '12px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Environment</span>
                  <span style={{ 
                    padding: '2px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700,
                    background: system.environment === 'live' ? 'rgba(0, 255, 163, 0.1)' : 'rgba(255, 171, 0, 0.1)',
                    color: system.environment === 'live' ? 'var(--primary)' : '#ffab00'
                  }}>
                    {system.environment.toUpperCase()}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '12px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Shortcode</span>
                  <span style={{ fontWeight: 600 }}>{system.shortcode}</span>
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Gateway API Key</label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <div style={{ 
                      flex: 1, padding: '8px 12px', background: 'rgba(0,0,0,0.3)', 
                      borderRadius: '8px', fontSize: '0.8rem', fontFamily: 'monospace', 
                      overflow: 'hidden', textOverflow: 'ellipsis', border: '1px solid var(--border)' 
                    }}>
                      {system.api_key}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  className="btn btn-outline" 
                  disabled={testingId === system.id}
                  style={{ flex: 1, height: '44px' }}
                  onClick={() => handleTestConnection(system.id)}
                >
                  {testingId === system.id ? <Loader2 className="animate-spin" size={18} /> : 'Test Connection'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAdd && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <form onSubmit={handleSubmit} className="glass animate-slide-up" style={{ width: '500px', padding: '40px', background: 'var(--bg-card)' }}>
            <h2 style={{ marginBottom: '8px' }}>{editingSystem ? 'Edit System' : 'Add New System'}</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '0.9rem' }}>
              {editingSystem ? 'Update your Daraja credentials.' : 'Enter your Daraja developer credentials.'}
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '8px', color: 'var(--text-muted)' }}>Display Name</label>
                <input required type="text" value={formData.name} style={{ width: '100%' }} placeholder="e.g. My Online Store" onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '8px', color: 'var(--text-muted)' }}>Environment</label>
                  <select 
                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', padding: '14px', borderRadius: '12px', color: '#fff' }} 
                    value={formData.environment}
                    onChange={(e) => setFormData({...formData, environment: e.target.value, shortcode: e.target.value === 'sandbox' ? '174379' : formData.shortcode})}
                  >
                    <option value="sandbox">Sandbox</option>
                    <option value="live">Live</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '8px', color: 'var(--text-muted)' }}>Shortcode</label>
                  <input required type="text" value={formData.shortcode} style={{ width: '100%' }} onChange={(e) => setFormData({...formData, shortcode: e.target.value})} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '8px', color: 'var(--text-muted)' }}>Consumer Key</label>
                <input required={!editingSystem} type="text" style={{ width: '100%' }} placeholder={editingSystem ? '(Leave blank to keep current)' : ''} onChange={(e) => setFormData({...formData, consumerKey: e.target.value})} />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '8px', color: 'var(--text-muted)' }}>Consumer Secret</label>
                <input required={!editingSystem} type="password" style={{ width: '100%' }} placeholder={editingSystem ? '(Leave blank to keep current)' : ''} onChange={(e) => setFormData({...formData, consumerSecret: e.target.value})} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '8px', color: 'var(--text-muted)' }}>Passkey (LNM)</label>
                <input required={!editingSystem} type="password" style={{ width: '100%' }} placeholder={editingSystem ? '(Leave blank to keep current)' : ''} onChange={(e) => setFormData({...formData, passkey: e.target.value})} />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button type="submit" disabled={saving} className="btn btn-primary" style={{ flex: 1 }}>
                  {saving ? <Loader2 className="animate-spin" size={20} /> : editingSystem ? 'Update System' : 'Save System'}
                </button>
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
