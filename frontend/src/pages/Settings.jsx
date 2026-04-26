import React, { useState, useEffect } from 'react';
import { Save, Shield, Key, Bell, AlertTriangle, Loader2 } from 'lucide-react';
import api from '../services/api';

const Settings = ({ user }) => {
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState({
    maintenance_mode: false,
    default_callback_url: '',
    email_alerts_enabled: true,
    raw_logging_enabled: true,
    master_admin_token: 'Loading...'
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await api.get('/settings');
      setConfig(data);
    } catch (err) {
      console.error('Failed to fetch settings', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    try {
      await api.put('/settings', config);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
        <Loader2 className="animate-spin" size={40} color="var(--primary)" />
      </div>
    );
  }

  return (
    <div className="animate-slide-up">
      <header style={{ marginBottom: '40px' }}>
        <h1>System Configuration</h1>
        <p>Manage global gateway behavior and administrative security preferences.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '40px' }}>
        <div className="glass" style={{ padding: '40px' }}>
          <form onSubmit={handleSave}>
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Shield size={20} color="var(--primary)" />
                Security & Core Behavior
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)' }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>Maintenance Mode</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Pause all incoming API requests globally.</div>
                  </div>
                  <div 
                    onClick={() => setConfig({...config, maintenance_mode: !config.maintenance_mode})}
                    style={{ 
                      width: '50px', height: '24px', borderRadius: '20px', padding: '4px', cursor: 'pointer', position: 'relative',
                      background: config.maintenance_mode ? 'rgba(255, 62, 62, 0.2)' : 'rgba(255,255,255,0.1)'
                    }}
                  >
                    <div style={{ 
                      width: '18px', height: '18px', background: config.maintenance_mode ? 'var(--error)' : '#fff', 
                      borderRadius: '50%', transform: config.maintenance_mode ? 'translateX(24px)' : 'translateX(0)',
                      transition: '0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}></div>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '10px', color: 'var(--text-muted)' }}>Default Callback URL</label>
                  <input 
                    type="text" 
                    value={config.default_callback_url || ''} 
                    placeholder="https://your-main-system.com/mpesa/callback" 
                    style={{ width: '100%' }} 
                    onChange={(e) => setConfig({...config, default_callback_url: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '40px' }}>
              <h3 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Bell size={20} color="var(--primary)" />
                Notifications
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={config.email_alerts_enabled} onChange={() => setConfig({...config, email_alerts_enabled: !config.email_alerts_enabled})} style={{ width: '20px', height: '20px' }} />
                  <span>Email me on failed callbacks</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={config.raw_logging_enabled} onChange={() => setConfig({...config, raw_logging_enabled: !config.raw_logging_enabled})} style={{ width: '20px', height: '20px' }} />
                  <span>Forward raw logs to master webhook</span>
                </label>
              </div>
            </div>

            <button type="submit" disabled={saving} className="btn btn-primary" style={{ minWidth: '200px' }}>
              {saving ? <Loader2 size={18} className="animate-spin" /> : success ? <Shield size={18} /> : <Save size={18} />}
              {success ? 'Settings Saved!' : 'Save Changes'}
            </button>
          </form>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass" style={{ padding: '32px', borderLeft: '4px solid var(--primary)' }}>
            <Key size={32} color="var(--primary)" style={{ marginBottom: '16px' }} />
            <h3>Master Admin Token</h3>
            <p style={{ fontSize: '0.85rem', marginBottom: '16px' }}>Use this token to manage your gateway programmatically.</p>
            <div style={{ background: '#000', padding: '12px', borderRadius: '12px', fontFamily: 'monospace', fontSize: '0.85rem', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{config.master_admin_token}</span>
              <button 
                onClick={() => { navigator.clipboard.writeText(config.master_admin_token); alert('Token copied!'); }}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.75rem' }}
              >
                COPY
              </button>
            </div>
          </div>

          <div className="glass" style={{ padding: '32px', borderLeft: '4px solid var(--error)' }}>
            <AlertTriangle size={32} color="var(--error)" style={{ marginBottom: '16px' }} />
            <h3>Danger Zone</h3>
            <p style={{ fontSize: '0.85rem', marginBottom: '24px' }}>Once you delete your account, there is no going back. Please be certain.</p>
            <button className="btn btn-outline" style={{ width: '100%', color: 'var(--error)', borderColor: 'rgba(255, 62, 62, 0.2)' }}>Delete Gateway Instance</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
