import React, { useState } from 'react';
import { Plus, Trash2, Edit2, ShieldCheck, Globe } from 'lucide-react';

const Systems = () => {
  const [showAdd, setShowAdd] = useState(false);

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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '24px' }}>
        {[1, 2].map((_, i) => (
          <div key={i} className="glass" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Globe size={20} color="var(--primary)" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem' }}>E-Commerce Store {i + 1}</h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: SYS-9283-X{i}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn-outline" style={{ padding: '8px' }}><Edit2 size={16} /></button>
                <button className="btn btn-outline" style={{ padding: '8px', color: 'var(--error)' }}><Trash2 size={16} /></button>
              </div>
            </div>

            <div style={{ spaceY: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Environment</span>
                <span style={{ color: i === 0 ? 'var(--primary)' : '#ffab00' }}>{i === 0 ? 'Live' : 'Sandbox'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Shortcode</span>
                <span>174379</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '16px' }}>
                <span style={{ color: 'var(--text-muted)' }}>API Key</span>
                <span style={{ fontFamily: 'monospace' }}>gwy_••••••••••••</span>
              </div>
            </div>

            <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border)', display: 'flex', gap: '8px' }}>
              <button className="btn btn-outline" style={{ width: '100%', fontSize: '0.8rem' }}>View Logs</button>
              <button className="btn btn-outline" style={{ width: '100%', fontSize: '0.8rem' }}>Test Connection</button>
            </div>
          </div>
        ))}
      </div>

      {showAdd && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="glass" style={{ width: '500px', padding: '32px' }}>
            <h2 style={{ marginBottom: '24px' }}>Add New M-Pesa System</h2>
            <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '8px', color: 'var(--text-muted)' }}>System Name</label>
                <input type="text" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', padding: '12px', borderRadius: '8px', color: '#fff' }} placeholder="e.g. Mobile App" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '8px', color: 'var(--text-muted)' }}>Consumer Key</label>
                  <input type="text" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', padding: '12px', borderRadius: '8px', color: '#fff' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '8px', color: 'var(--text-muted)' }}>Consumer Secret</label>
                  <input type="password" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', padding: '12px', borderRadius: '8px', color: '#fff' }} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save Credentials</button>
                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowAdd(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Systems;
